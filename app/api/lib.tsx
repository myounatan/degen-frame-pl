
import { CHAIN_TO_ADDRESSES_MAP, ChainId, Token } from '@uniswap/sdk-core';
import { FeeAmount, Pool, TICK_SPACINGS, TickMath, computePoolAddress, priceToClosestTick } from '@uniswap/v3-sdk';
import { ApolloClient, DocumentNode, HttpLink, InMemoryCache, gql, split } from '@apollo/client/core';
import { DEX_CACHE_TIME, LAST_5_TOKEN1_SWAPS_QUERY, TOKEN1_SWAPS_QUERY } from "./config";
import { DexResult, HistoryResult, PLResult, SwapType, TokenPosition, TokenSwapRecord } from './types';
import dotenv from 'dotenv';
import { Contract, JsonRpcProvider } from 'ethers';
dotenv.config();

// only balanceOf(address) required
const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ');
}

// create a function to read number of 0's after decimal and use <span tw="text-6xl justify-end items-end -mb-2">4</span> to create subscript
export function formatDecimal(num: number, ...classNames: string[]) {
  const zeroCount = countZerosAfterDecimal(num);
  
  if (zeroCount < 3) return num.toString();

  const splitNum = num.toString().split('.');

  return (
    <>${splitNum[0]}.0<span tw={cn("justify-end items-end -mb-2", ...classNames)}>{zeroCount}</span>{splitNum[1].substring(zeroCount, length + zeroCount)}</>
  )
}

// create a function to format a percentage number (already in percentage notation) to use green (#39c040) or red (#c03939) based on positive or negative
// and format the string to include a '+' sign if positive, and a '-' sign if negative. if 0, return without a sign and use color grey (#8d8d8d)
export function formatPercentage(num: number, ...classNames: string[]) {
  if (num > 0) return <span tw={cn("text-[#39c040]", ...classNames)}>+{num}%</span>;
  if (num < 0) return <span tw={cn("text-[#c03939]", ...classNames)}>-{num}%</span>;
  return <span tw={cn("text-[#8d8d8d]", ...classNames)}>+0%</span>;
}

export async function getBalanceOf(address: string, tokenAddress: string): Promise<bigint> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const erc20 = new Contract(tokenAddress, ERC20_ABI, provider);

  return await erc20.balanceOf(address);
}

async function getPoolDexResult(poolAddress: string): Promise<DexResult> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/base/${poolAddress}`, {
    next: {
      revalidate: DEX_CACHE_TIME,
    },
  });
  const data = await res.json();

  return {
    priceUSD: data.pair.priceUsd,
    priceChange: {
      m5: data.pair.priceChange.m5,
      h1: data.pair.priceChange.h1,
      h6: data.pair.priceChange.h6,
      h24: data.pair.priceChange.h24,
    },
  }
}

function countZerosAfterDecimal(num: number): number {
  const match = num.toString().match(/\.0*/);
  return match ? match[0].length - 1 : 0;
}

// function formatDecimal(num: number, length: number = 4): string {
//   const zeros = countZerosAfterDecimal(num);
//   if (zeros <= 3) return num.toString();

//   const splitNum = num.toString().split('.');

//   return `${splitNum[0]}.0${toSubscript(zeros)}${splitNum[1].substring(zeros, length + zeros)}`;
// }

async function getSwaps(query: DocumentNode, userAddress: string, tokenAddress: string): Promise<any> {
  const uniswapClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest' }),
    cache: new InMemoryCache()
  });

  const swaps = await uniswapClient.query({
    query,
    variables: {
      origin: userAddress,
      token1: tokenAddress
    }
  })

  return swaps.data.swaps
}

export async function getPL(userAddress: string, tokenAddress: string, poolAddress: string): Promise<PLResult> {
  const swaps = await getSwaps(TOKEN1_SWAPS_QUERY, userAddress, tokenAddress)

  // console.log(swaps.data.swaps)

  let swapRecords: TokenSwapRecord[] = []
  let position: TokenPosition = { totalShares: 0, totalAmountUSD: 0, totalBuyAmountUSD: 0, totalBuyShares: 0, averageCostPerShare: 0 }

  swaps.forEach((swap: any) => {
    let amount, amountUSD, tokenUSD

    // uniswap represents numbers as negative from the pool, i want it negative from the user's perspective
    if (parseFloat(swap.amount0) < 0) { // SELL
      amount = parseFloat(swap.amount1) * -1
      amountUSD = parseFloat(swap.amountUSD) * -1
    } else { // BUY
      amount = Math.abs(parseFloat(swap.amount1))
      amountUSD = Math.abs(parseFloat(swap.amountUSD))
    }

    tokenUSD = amountUSD / amount

    console.log(`token1Address: ${tokenAddress} | amount: ${amount} | amountUSD: ${amountUSD} | ${amountUSD / amount}`)

    let record: TokenSwapRecord = { amount, amountUSD, tokenUSD }
    swapRecords.push(record)
  })

  swapRecords.forEach((record: TokenSwapRecord) => {
    position.totalShares += record.amount
    position.totalAmountUSD += record.amountUSD

    if (record.amount > 0) position.totalBuyShares += record.amount
    if (record.amountUSD > 0) position.totalBuyAmountUSD += record.amountUSD
  })

  position.averageCostPerShare = position.totalShares > 0 ? position.totalAmountUSD / position.totalShares : 0

  const tokenBalance = await getBalanceOf(userAddress, tokenAddress)
  const totalPurchaseAmountUSD = position.totalAmountUSD
  const averagePurchasePrice = position.averageCostPerShare

  const dexResult: DexResult = await getPoolDexResult(poolAddress)

  let percentageDifference = 0, multipleDifference = 0

  if (averagePurchasePrice > 0) {
    // get percentage difference between average purchase price and current price
    percentageDifference = ((dexResult.priceUSD - averagePurchasePrice) / averagePurchasePrice) * 100
  
    // get multiple difference
    multipleDifference = dexResult.priceUSD / averagePurchasePrice
  }

  const entryValueUSD = totalPurchaseAmountUSD
  const currentValueUSD = dexResult.priceUSD * Number(tokenBalance)

  console.log(`Token Balance: ${tokenBalance}`)
  console.log(`Average Cost per Share: ${averagePurchasePrice} | Current Price per Share: ${dexResult.priceUSD}`)
  console.log(`% diff: ${percentageDifference}% (x${multipleDifference})`)
  console.log(`Entry Value in USD: $${entryValueUSD} | Current Value in USD: $${dexResult.priceUSD}`)

  return {
    dexResult,
    averagePurchasePrice,
    percentageDifference,
    multipleDifference,
    entryValueUSD,
    currentValueUSD,
    tokenBalance
  }
}

export async function getLast5Swaps(userAddress: string, tokenAddress: string, poolAddress: string): Promise<HistoryResult> {
  const swaps = await getSwaps(LAST_5_TOKEN1_SWAPS_QUERY, userAddress, tokenAddress)

  // console.log(swaps.data.swaps)

  const dexResult: DexResult = await getPoolDexResult(poolAddress)

  let swapRecords: TokenSwapRecord[] = []

  swaps.forEach((swap: any) => {
    let amount, amountUSD, tokenUSD
    let swapType: SwapType

    // uniswap represents numbers as negative from the pool, i want it negative from the user's perspective
    if (parseFloat(swap.amount0) < 0) { // SELL
      amount = parseFloat(swap.amount1) * -1
      amountUSD = parseFloat(swap.amountUSD) * -1
      swapType = 'sell'
    } else { // BUY
      amount = Math.abs(parseFloat(swap.amount1))
      amountUSD = Math.abs(parseFloat(swap.amountUSD))
      swapType = 'buy'
    }

    tokenUSD = amountUSD / amount
    amount = amount
    amountUSD = amountUSD

    let record: TokenSwapRecord= { amount, amountUSD, tokenUSD, swapType }
    swapRecords.push(record)
  })

  return {
    dexResult,
    swapRecords
  }
}

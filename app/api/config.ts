import { gql } from "@apollo/client/core";

import dotenv from 'dotenv';
dotenv.config();


export const DEGEN_MIN_AMOUNT = 100;
export const FRAME_MIN_AMOUNT = 1000;

export const DEX_CACHE_TIME = 60;

export const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;

export const DEGEN_ADDRESS = '0x4ed4e862860bed51a9570b96d89af5e1b0efefed';
export const FRAME_ADDRESS = '0x91f45aa2bde7393e0af1cc674ffe75d746b93567';

export const DEGEN_POOL_ADDRESS = '0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA';
export const FRAME_POOL_ADDRESS = '0x087Fb86aE1856c2FD375Cfea68E0F74dF9ec6906';

export const TOKEN1_SWAPS_QUERY = gql`
  query GetSwaps($origin: Bytes!, $token1: Bytes!) {
    swaps (first: 1000, where: {origin: $origin, token1: $token1}, orderDirection: desc, orderBy: timestamp) {
      transaction {
        id
      }
      timestamp
      pool {
        id
      }
      recipient
      sender
      origin
      amount0
      amount1
      amountUSD
      token0 {
        id
        name
        symbol
        derivedETH
      }
      token1 {
        id
        name
        symbol
        derivedETH
      }
      logIndex
    }
  }
`

export const LAST_5_TOKEN1_SWAPS_QUERY = gql`
  query GetSwaps($origin: Bytes!, $token1: Bytes!) {
    swaps (first: 5, where: {origin: $origin, token1: $token1}, orderDirection: desc, orderBy: timestamp) {
      transaction {
        id
      }
      timestamp
      pool {
        id
      }
      recipient
      sender
      origin
      amount0
      amount1
      amountUSD
      token0 {
        id
        name
        symbol
        derivedETH
      }
      token1 {
        id
        name
        symbol
        derivedETH
      }
      logIndex
    }
  }
`



/*

P/L STATS TAILWIND DIV
<div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }}
>
  <div class="bg-[#061026] grid justify-center items-center p-1">
    <div class="flex flex-auto justify-center text-4xl">
      <p class="text-[#9c65ef] font-bold">$DEGEN</p>
      <span class="text-[#1abffc] ml-2">$0.005327</span>
    </div>
    <div class="grid grid-cols-4 grid-rows-1 gap-x-2 px-14">
      <div class="bg-[#061026] rounded-md text-center border border-[#1a2338] p-0 col-span-1">
        <p class="text-[#8d8d8d] text-xs">5M</p>
        <p class="text-[#c03939] font-bold overflow-hidden">-5.4%</p>
      </div>
      <div class="bg-[#061026] rounded-md text-center border border-[#1a2338] p-0 col-span-1">
        <p class="text-[#8d8d8d] text-xs">1H</p>
        <p class="text-[#c03939] font-bold overflow-hidden">-5.4%</p>
      </div>
      <div class="bg-[#061026] rounded-md text-center border border-[#1a2338] p-0 col-span-1">
        <p class="text-[#8d8d8d] text-xs">6H</p>
        <p class="text-[#c03939] font-bold overflow-hidden">-5.4%</p>
      </div>
      <div class="bg-[#061026] rounded-md text-center border border-[#1a2338] p-0 col-span-1">
        <p class="text-[#8d8d8d] text-xs">24H</p>
        <p class="text-[#39c040] font-bold overflow-hidden">+19.6%</p>
      </div>
    </div>

    <p class="text-[#8d8d8d] text-sm col-span-1 text-center mt-2 border border-[#1a2338] mb-1 rounded-md">0x23131e194d5881c7746D8B00e9365657fD2cB227</p>
    <div class="grid grid-cols-3 grid-rows-2 gap-1 items-center justify-center text-center">
      <div class="space-y-0 border border-[#1a2338] p-1 col-span-1 rounded-md">
        <p class="text-[#8d8d8d] text-sm col-span-1">Entry Value (USD)</p>
        <p class="text-[#1abffc] text-3xl font-bold col-span-1 overflow-hidden">$30,003.56</p>
      </div>
      <div class="space-y-0 border border-[#1a2338] p-1 col-span-1 rounded-md">
        <p class="text-[#8d8d8d] text-sm col-span-1">Avg Purchase Price (USD)</p>
        <p class="text-[#1abffc] text-3xl font-bold col-span-1 overflow-hidden">$0.2586</p>
      </div>
      <div class="space-y-0 border border-[#1a2338] p-1 col-span-1 rounded-md">
        <p class="text-[#8d8d8d] text-sm col-span-1">Token Balance</p>
        <p class="text-[#1abffc] text-3xl font-bold col-span-1 overflow-hidden">180,200</p>
      </div>
      <div class="space-y-0 border border-[#1a2338] p-1 col-span-1 rounded-md">
        <p class="text-[#8d8d8d] text-sm col-span-1">Current Value (USD)</p>
        <p class="text-[#39c040] text-3xl font-bold col-span-1 overflow-hidden">$198.10</p>
      </div>
    <div class="space-y-0 border border-[#1a2338] p-1 col-span-2 rounded-md">
      <p class="text-[#8d8d8d] text-sm col-span-1">Profit/Loss</p>
      <p class="text-[#39c040] text-3xl font-semibold col-span-1 overflow-hidden">+55.6% (1.56x)</p>
    </div>
    </div>
  </div>
</div>


SWAP HISTORY TAILWIND DIV
<div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }}
>
  <div class="bg-[#061026] grid justify-center items-center p-1 gap-y-1">
    <div class="flex flex-auto justify-center text-4xl">
      <p class="text-[#9c65ef] font-bold">$DEGEN</p>
      <span class="text-[#1abffc] ml-2">$0.005327</span>
    </div>

    <div class="grid grid-cols-1 gap-y-1">
      <p class="text-[#8d8d8d] text-sm col-span-1 text-center mt-2 border border-[#1a2338] -mx-10 rounded-md">0x23131e194d5881c7746D8B00e9365657fD2cB227</p>

      <div class="grid grid-cols-7 items-center justify-center text-xl -mx-10 opacity-100 border border-[#566486] rounded-md">
        <div class="flex col-span-1 space-y-0 text-center items-center justify-center">
          <p class="text-[#39c040]">BUY</p>
        </div>
        <div class="flex col-span-6 space-y-0 border-l border-[#566486] justify-center text-center items-center gap-x-2 pr-1">
          <p class="text-[#8d8d8d]"></p>
          <p class="text-[#1abffc] font-bold">$132.88</p>
          <p class="text-[#8d8d8d]">|</p>
          <p class="text-[#1abffc] font-bold">10,000</p>
          <p class="text-[#8d8d8d]">@</p>
          <p class="text-[#1abffc] font-bold">$0.0003765</p>
        </div>
      </div>
      <div class="grid grid-cols-7 items-center justify-center text-xl -mx-8 opacity-90 border border-[#566486] rounded-md">
        <div class="flex col-span-1 space-y-0 text-center items-center justify-center">
          <p class="text-[#c07a39]">SELL</p>
        </div>
        <div class="flex col-span-6 space-y-0 border-l border-[#566486] justify-center text-center items-center gap-x-2 pr-1">
          <p class="text-[#8d8d8d]"></p>
          <p class="text-[#1abffc] font-bold">$132.88</p>
          <p class="text-[#8d8d8d]">|</p>
          <p class="text-[#1abffc] font-bold">10,000</p>
          <p class="text-[#8d8d8d]">@</p>
          <p class="text-[#1abffc] font-bold">$0.0003765</p>
        </div>
      </div>
      <div class="grid grid-cols-7 items-center justify-center text-xl -mx-6 opacity-80 border border-[#566486] rounded-md">
        <div class="flex col-span-1 space-y-0 text-center items-center justify-center">
          <p class="text-[#c07a39]">SELL</p>
        </div>
        <div class="flex col-span-6 space-y-0 border-l border-[#566486] justify-center text-center items-center gap-x-2 pr-1">
          <p class="text-[#8d8d8d]"></p>
          <p class="text-[#1abffc] font-bold">$132.88</p>
          <p class="text-[#8d8d8d]">|</p>
          <p class="text-[#1abffc] font-bold">10,000</p>
          <p class="text-[#8d8d8d]">@</p>
          <p class="text-[#1abffc] font-bold">$0.0003765</p>
        </div>
      </div>
      <div class="grid grid-cols-7 items-center justify-center text-xl -mx-4 opacity-70 border border-[#566486] rounded-md">
        <div class="flex col-span-1 space-y-0 text-center items-center justify-center">
          <p class="text-[#c07a39]">SELL</p>
        </div>
        <div class="flex col-span-6 space-y-0 border-l border-[#566486] justify-center text-center items-center gap-x-2 pr-1">
          <p class="text-[#8d8d8d]"></p>
          <p class="text-[#1abffc] font-bold">$132.88</p>
          <p class="text-[#8d8d8d]">|</p>
          <p class="text-[#1abffc] font-bold">10,000</p>
          <p class="text-[#8d8d8d]">@</p>
          <p class="text-[#1abffc] font-bold">$0.0003765</p>
        </div>
      </div>
      <div class="grid grid-cols-7 items-center justify-center text-xl -mx-2 opacity-60 border border-[#566486] rounded-md">
        <div class="flex col-span-1 space-y-0 text-center items-center justify-center">
          <p class="text-[#c07a39]">SELL</p>
        </div>
        <div class="flex col-span-6 space-y-0 border-l border-[#566486] justify-center text-center items-center gap-x-2 pr-1">
          <p class="text-[#8d8d8d]"></p>
          <p class="text-[#1abffc] font-bold">$132.88</p>
          <p class="text-[#8d8d8d]">|</p>
          <p class="text-[#1abffc] font-bold">10,000</p>
          <p class="text-[#8d8d8d]">@</p>
          <p class="text-[#1abffc] font-bold">$0.0003765</p>
        </div>
      </div>
    </div>
  </div>
</div>



*/

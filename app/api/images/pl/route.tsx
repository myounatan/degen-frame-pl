import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { cn, commify, formatDecimal, formatPercentage } from "./lib";

export const runtime = "experimental-edge"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  let paramToken: string | null = searchParams.get("token")
  let paramAccount: string | null = searchParams.get("account")
  let paramPriceUSD: string | null = searchParams.get("price_usd")
  let paramChange5M: string | null = searchParams.get("change_5m")
  let paramChange1H: string | null = searchParams.get("change_1h")
  let paramChange6H: string | null = searchParams.get("change_6h")
  let paramChange24H: string | null = searchParams.get("change_24h")
  let paramEntryValueUSD: string | null = searchParams.get("entry_usd")
  let paramAvgPurchasePrice: string | null = searchParams.get("avg_purchase_usd")
  let paramTokenBalance: string | null = searchParams.get("token_balance")
  let paramCurrentValueUSD: string | null = searchParams.get("current_usd")
  let percentageDifference: string | null = searchParams.get("percentage_diff")
  let multipleDifference: string | null = searchParams.get("multiple_diff")

  // build me a demo url
  // https://pl-image.vercel.app/api/pl?token=DEGEN&account=0x23131e194d5881c7746D8B00e9365657fD2cB227&price_usd=0.005327&change_5m=-5.4&change_1h=-5.4&change_6h=-5.4&change_24h=55.4&entry_usd=3003.576666&avg_purchase_usd=0.042564&token_balance=888888926&current_usd=3003.56&percentage_diff=0.0&multiple_diff=1.0

  // format data
  const priceUSD = formatDecimal(paramPriceUSD || "0", 'text-6xl')
  
  // use +/- notation for price changes
  const change5M = parseFloat(paramChange5M || "0")
  const change1H = parseFloat(paramChange1H || "0")
  const change6H = parseFloat(paramChange6H || "0")
  const change24H = parseFloat(paramChange24H || "0")

  let entryValueUSD = parseFloat(paramEntryValueUSD || "0")
  let entryValueUSDFormatted = commify(entryValueUSD)

  let avgPurchasePrice = formatDecimal(paramAvgPurchasePrice || "0", 'text-4xl')
  let tokenBalance = commify(parseFloat(paramTokenBalance || "0"))

  let currentValueUSD = parseFloat(paramCurrentValueUSD || "0")
  let currentValueUSDFormatted = commify(currentValueUSD)
  const currentValueUSDColor = currentValueUSD > entryValueUSD ? 'text-[#39c040]' : (currentValueUSD == entryValueUSD ? 'text-[#8d8d8d]' : 'text-[#c03939]')
  
  // use +/- notation for percentage difference
  const percentageDiff = parseFloat(percentageDifference || "0")
  const percentageDiffFormatted = percentageDiff > 0 ? `+${percentageDiff}%` : (percentageDiff == 0 ? `-` : `-${percentageDiff}%`)

  // use xNUM notation for multiple difference
  const multipleDiff = parseFloat(multipleDifference || "1")
  const multipleDiffFormatted = multipleDiff == 1 ? '' : `(x${multipleDiff})`

  try {
    return new ImageResponse(

<div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
  }}
>
  <div tw="flex bg-[#061026] justify-center w-[100%]">
    <div tw="flex flex-wrap justify-center px-5 w-full">
      <div tw="flex w-full justify-center items-center text-center text-8xl items-center -m-24">
        <p tw="text-[#9c65ef] mr-8">${paramToken}</p>
        <p tw="text-[#1abffc]">${priceUSD}</p>
      </div>
      <div tw="flex px-14">
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[200px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-2xl -mb-2">5M</p>
          {formatPercentage(change5M, 'justify-center w-full text-4xl overflow-hidden mb-4')}
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[200px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-2xl -mb-2">1H</p>
          {formatPercentage(change1H, 'justify-center w-full text-4xl overflow-hidden mb-4')}
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[200px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-2xl -mb-2">6H</p>
          {formatPercentage(change6H, 'justify-center w-full text-4xl overflow-hidden mb-4')}
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[200px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-2xl -mb-2">24H</p>
          {formatPercentage(change24H, 'justify-center w-full text-4xl overflow-hidden mb-4')}
        </div>
      </div>

      <p tw="flex w-full text-[#8d8d8d] text-4xl text-center justify-center mt-2 border border-[#1a2338] mb-1 rounded-md">
        Account - {paramAccount}
      </p>
      
      <div tw="flex items-center justify-center text-center w-full">
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[375px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-4xl -mb-4 -py-4">Entry Value (USD)</p>
          <p tw="justify-center w-full text-[#1abffc] text-6xl overflow-hidden">${entryValueUSDFormatted}</p>
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[375px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-4xl -mb-4 -py-4">Avg Purchase (USD)</p>
          <p tw="justify-center w-full text-[#1abffc] text-6xl overflow-hidden">${avgPurchasePrice}</p>
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[375px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-4xl -mb-4 -py-4">Token Balance</p>
          <p tw="justify-center w-full text-[#1abffc] text-6xl overflow-hidden">{tokenBalance}</p>
        </div>
      </div>
      
      <div tw="flex items-center justify-center text-center w-full">
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[570px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-4xl -mb-4 -py-4">Current Value (USD)</p>
          <p tw={cn("justify-center w-full text-6xl overflow-hidden", currentValueUSDColor)}>${currentValueUSDFormatted}</p>
        </div>
        <div tw="flex flex-wrap bg-[#061026] rounded-md border border-[#1a2338] m-2 w-[570px]">
          <p tw="justify-center w-full text-[#8d8d8d] text-4xl -mb-4 -py-4">Profit/Loss</p>
          <p tw={cn("justify-center w-full text-6xl overflow-hidden", currentValueUSDColor)}>{percentageDiffFormatted} {multipleDiffFormatted}</p>
        </div>
      </div>

    </div>
  </div>
</div>
  

    );
  } catch (e) {
    console.error(e);
  }
}

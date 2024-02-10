import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { cn, commify, formatDecimal, formatPercentage } from "./lib";

export const runtime = "experimental-edge"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  let paramToken: string | null = searchParams.get("token")
  let paramAccount: string | null = searchParams.get("account")
  let paramPriceUSD: string | null = searchParams.get("price_usd")
  let paramChangeM5: string | null = searchParams.get("change_m5")
  let paramChangeH1: string | null = searchParams.get("change_h1")
  let paramChangeH6: string | null = searchParams.get("change_h6")
  let paramChangeH24: string | null = searchParams.get("change_h24")

  // let paramSwap1: string | null = searchParams.get("swap_1")
  // let paramSwap2: string | null = searchParams.get("swap_2")
  // let paramSwap3: string | null = searchParams.get("swap_3")
  // let paramSwap4: string | null = searchParams.get("swap_4")
  // let paramSwap5: string | null = searchParams.get("swap_5")

  // swap format json string: &swap_X={"type":"buy","price":"0.0003765","amount":"50000","amountUSD":"132.88"}

  // build array of swaps
  let swaps = []
  for (let i = 1; i <= 5; i++) {
    let swap: string | null = searchParams.get(`swap_${i}`)
    if (swap) {
      const data = JSON.parse(swap)
      swaps.push({
        key: i-1,
        type: data.type.toUpperCase(),
        price: (<>${formatDecimal(data.price || "0", 'text-3xl')}</>),
        amount: commify(parseFloat(data.amount)),
        amountUSD: `$${commify(parseFloat(data.amountUSD))}`,
      })
    }
  }

  // format data
  const priceUSD = formatDecimal(paramPriceUSD || "0", 'text-6xl')
  
  // use +/- notation for price changes
  const change5M = parseFloat(paramChangeM5 || "0")
  const change1H = parseFloat(paramChangeH1 || "0")
  const change6H = parseFloat(paramChangeH6 || "0")
  const change24H = parseFloat(paramChangeH24 || "0")

  // build me a sample url
  // http://localhost:3000/api/images/history?token=DEGEN&price_usd=0.005327&change_m5=-5.4&change_h1=-5.4&change_h6=-5.4&change_h24=55.4&account=0x23131e194d5881c7746D8B00e9365657fD2cB227&swap_1={"type":"buy","price":"0.0003765","amount":"50000","amountUSD":"132.88"}&swap_2={"type":"sell","price":"0.0003765","amount":"50000","amountUSD":"132.88"}&swap_3={"type":"buy","price":"0.0003765","amount":"50000","amountUSD":"132.88"}&swap_4={"type":"sell","price":"0.0003765","amount":"50000","amountUSD":"132.88"}&swap_5={"type":"buy","price":"0.0003765","amount":"50000","amountUSD":"132.88"}

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

      <p tw="flex w-full text-[#8d8d8d] text-4xl text-center justify-center mt-1 border border-[#1a2338] mb-1 rounded-md">
        Last 5 Swaps - {paramAccount}
      </p>

      <div tw="flex flex-wrap items-center justify-center text-center w-[100%] mt-1">
        {swaps.length == 0 ?
          <span tw="text-3xl text-[#8d8d8d] h-[280px] w-full items-center justify-center">
            No UniswapV3 swaps found.
          </span> : swaps.map((swap) => (
            <div key={swap.key} tw={cn(`opacity-${100-(swap.key*15)}`, "mt-3 flex items-center justify-center text-5xl border border-[#566486] rounded-2xl h-[53px] w-auto px-5")}>
              <div tw="flex text-center items-center justify-center w-[120px]">
                <p tw={cn(swap.type == "BUY" ? "text-[#39c040]" : "text-[#c07a39]")}>{swap.type}</p>
              </div>
              <div tw="flex justify-center text-center items-center justify-center pr-1">
                <span tw="flex flex-auto text-[#1abffc]">{swap.amountUSD}</span>
                <span tw="text-[#8d8d8d] w-[40px] justify-center">|</span>
                <span tw="text-[#1abffc] justify-center">{swap.amount}</span>
                <span tw="text-[#8d8d8d] w-[70px] justify-center">@</span>
                <span tw="text-[#1abffc] justify-center">{swap.price}</span>
              </div>
            </div>
          ))
        }
      </div>
      

    </div>
  </div>
</div>
  

    );
  } catch (e) {
    console.error(e);
  }
}

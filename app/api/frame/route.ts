import { FrameRequest, getFrameMessage, getFrameHtmlResponse, FrameButtonMetadata } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { DEGEN_ADDRESS, DEGEN_POOL_ADDRESS, DEX_CACHE_TIME, FRAME_ADDRESS, FRAME_POOL_ADDRESS, NEXT_PUBLIC_URL } from '../config';
import { DexResult, HistoryResult, PLResult } from '../types';
import { getLast5Swaps, getPL } from '../lib';


/* url params:
  - token: specifies the token to display data for, can be 'degen' or 'frame'
  - tab: specifies the type of data to display, can be 'pl' (p/l) or 'history' (last 5 buy/sell logs)
  - account: specifies the account index to display data for
*/

enum ButtonInput {
  Home = 1,
  SwitchView = 2,
  PrevAccount = 3,
  NextAccount = 4,
}

function getHomeResponse(): NextResponse {
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '$DEGEN',
        },
        {
          label: '$FRAME',
        },
      ],
      image: `${NEXT_PUBLIC_URL}/start.png`,
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const paramToken: string | null = searchParams.get("token")
  const paramTab: string | null = searchParams.get("tab")
  const paramAccount: string | null = searchParams.get("account")

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  console.log(`isValid: ${isValid}`)
  console.log(`message: ${JSON.stringify(message)}`)

  // // if not included, then we are coming from home
  // // set to degen if 1 and frame if 2
  // if (!paramToken && !paramTab && !paramAccount) {
  //   token = message?.button === 1 ? 'degen' : 'frame';
  // }


  if (!isValid) {
    return getHomeResponse();
  }

  let accountIndex = paramAccount ? parseInt(paramAccount) : 0
  let accountAddress: string | undefined = '';
  let currentTab = paramTab == 'pl' ? 'pl' : 'history';

  let navButtons: FrameButtonMetadata[] = []

  let token = paramToken === 'frame' ? 'frame' : 'degen';

  const numAccounts = message.interactor.verified_accounts.length;

  // handle button input
  if (!paramToken) {
    token = message?.button === 1 ? 'degen' : 'frame';
    currentTab = 'pl';
  } else {
    switch (message?.button) {
      case 1:
        token = token === 'degen' ? 'frame' : 'degen';
        break;
      case 2:
        currentTab = currentTab === 'pl' ? 'history' : 'pl';
        break;
      // case 3:
      //   return getHomeResponse();
      case 3:
        accountIndex = (accountIndex + 1) % numAccounts;
        break;
    }
  }

  const tokenAddress = token === 'frame' ? FRAME_ADDRESS : DEGEN_ADDRESS;
  const poolAddress = token === 'frame' ? FRAME_POOL_ADDRESS : DEGEN_POOL_ADDRESS;

  const switchViewButton = {
    label: currentTab === 'pl' ? 'View Swap History' : 'View Profit/Loss',
  }

  accountIndex = Math.min(accountIndex, numAccounts - 1);
  accountAddress = message.interactor.verified_accounts[accountIndex];

  console.log(`paramToken: ${token}`)
  console.log(`currentTab: ${currentTab}`)
  console.log(`accountAddress: ${accountAddress}`)

  if (numAccounts > 1) {
    navButtons = [
      {
        label: `Next Account`,
      },
    ]
  }

  // build image url for current tab and account
  let imageUrl = `${NEXT_PUBLIC_URL}/api/images/${currentTab}?token=${token}&account=${accountAddress}`

  let dexResult: DexResult | undefined

  if (currentTab === 'pl') {
    const plResult: PLResult = await getPL(accountAddress, tokenAddress, poolAddress);
    dexResult = plResult.dexResult;

    imageUrl += `&entry_usd=${plResult.entryValueUSD}&avg_purchase_usd=${plResult.averagePurchasePrice}&token_balance=${plResult.tokenBalance}&current_usd=${plResult.currentValueUSD}&percentage_diff=${plResult.percentageDifference}&multiple_diff=${plResult.multipleDifference}`
  } else if (currentTab === 'history') {
    const swapHistory: HistoryResult = await getLast5Swaps(accountAddress, tokenAddress, poolAddress);
    dexResult = swapHistory.dexResult;

    // generate swap list params
    swapHistory.swapRecords.forEach((record, index) => {
      // stringify all props
      const stringData = encodeURIComponent(JSON.stringify({
        swapType: record.swapType,
        tokenUSD: record.tokenUSD.toString(),
        amount: record.amount.toString(),
        amountUSD: record.amountUSD.toString(),
      }))
      imageUrl += `&swap_${index + 1}=${stringData}`
    })
  }

  // add dex params
  if (dexResult) {
    imageUrl += `&price_usd=${dexResult.priceUSD}&change_m5=${dexResult.priceChange.m5}&change_h1=${dexResult.priceChange.h1}&change_h6=${dexResult.priceChange.h6}&change_h24=${dexResult.priceChange.h24}`
  }

  console.log(`imageUrl: ${imageUrl}`)

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `View ${token === 'degen' ? '$FRAME' : '$DEGEN'}`,
        },
        switchViewButton,
        // {
        //   label: 'Home',
        // },
        ...navButtons,
      ],
      image: imageUrl,
      postUrl: `${NEXT_PUBLIC_URL}/api/frame?tab=${currentTab}&account=${accountIndex}&token=${token}`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

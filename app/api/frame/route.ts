import { FrameRequest, getFrameMessage, getFrameHtmlResponse, FrameButtonMetadata } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { DEGEN_ADDRESS, DEGEN_POOL_ADDRESS, DEX_CACHE_TIME, FRAME_ADDRESS, FRAME_POOL_ADDRESS, NEXT_PUBLIC_URL } from '../config';


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
          label: 'Load $DEGEN P/L',
        },
        {
          label: 'Load $FRAME P/L',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/start.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  let token: string | null = searchParams.get("token")
  const tab: string | null = searchParams.get("tab")
  const account: string | null = searchParams.get("account")

  if (!token || !tab) {
    return getHomeResponse();
  }

  let tokenAddress: string | undefined = '';
  let accountIndex = account ? parseInt(account) : 0
  let accountAddress: string | undefined = '';
  let currentTab = tab === 'pl' ? 'pl' : 'history';
  // let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  let navButtons: FrameButtonMetadata[] = []

  if (!isValid) {
    return getHomeResponse();
  }

  switch (message?.button) {
    case ButtonInput.Home:
      return getHomeResponse();
    case ButtonInput.SwitchView:
      currentTab = tab === 'pl' ? 'history' : 'pl';
      break;
    case ButtonInput.PrevAccount:
      accountIndex = Math.max(accountIndex - 1, 0);
      break;
    case ButtonInput.NextAccount:
      accountIndex = Math.min(accountIndex + 1, message.interactor.verified_accounts.length - 1);
      break;
  }

  token = token === 'frame' ? 'frame' : 'degen';
  tokenAddress = token === 'frame' ? FRAME_ADDRESS : DEGEN_ADDRESS;
  const poolAddress = token === 'frame' ? FRAME_POOL_ADDRESS : DEGEN_POOL_ADDRESS;

  const switchViewButton = {
    label: currentTab === 'pl' ? 'View History' : 'View P/L',
  }

  const numAccounts = message.interactor.verified_accounts.length;
  accountIndex = Math.min(accountIndex, numAccounts - 1);
  accountAddress = message.interactor.verified_accounts[accountIndex];

  if (numAccounts > 1 && accountIndex > 0 && accountIndex < numAccounts - 1) {
    navButtons = [
      {
        label: `Prev Account`,
      },
      {
        label: `Next Account`,
      },
    ]
  } else if (numAccounts > 1 && accountIndex === 0) {
    navButtons = [
      {
        label: `Next Account`,
      },
    ]
  } else if (numAccounts > 1 && accountIndex === numAccounts - 1) {
    navButtons = [
      {
        label: `Prev Account`,
      },
    ]
  }

  // if (message?.input) {
  //   text = message.input;
  // }

  // if (message?.button === 3) {
  //   return NextResponse.redirect(
  //     'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
  //     { status: 302 },
  //   );
  // }

  // render page based on tab and account

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Home`,
        },
        switchViewButton,
        ...navButtons,
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame?tab=${currentTab}&account=${accountIndex}`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

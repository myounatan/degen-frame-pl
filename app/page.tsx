import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './api/config';
import { ImageResponse } from 'next/dist/compiled/@vercel/og';

const frameMetadata = getFrameMetadata({
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
    // aspectRatio: '1:1',
  },
  // input: {
  //   text: 'Tell me a boat story',
  // },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: '$DEGEN $FRAME P/L',
  description: 'View your $DEGEN and $FRAME Profit/Loss.',
  openGraph: {
    title: '$DEGEN $FRAME P/L',
    description: 'View your $DEGEN and $FRAME Profit/Loss.',
    images: [`${NEXT_PUBLIC_URL}/start.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>degen-frame-pl</h1>
    </>
  );
}

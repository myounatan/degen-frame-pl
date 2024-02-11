import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './api/config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start',
    }
  ],
  image: `${NEXT_PUBLIC_URL}/start.png`,
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

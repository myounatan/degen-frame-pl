export interface DexResult {
  priceUSD: number;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
}

export type SwapType = 'buy' | 'sell'
export interface TokenSwapRecord {
  amount: number // shares
  amountUSD: number // total price of shares
  tokenUSD: number // price per share
  swapType?: SwapType
}

export interface TokenPosition {
  totalShares: number
  totalBuyShares: number // buys only
  totalAmountUSD: number
  totalBuyAmountUSD: number // buys only
  averageCostPerShare: number
}

export interface PLResult {
  // public info
  dexResult: DexResult;

  // user info
  averagePurchasePrice: number;
  percentageDifference: number;
  multipleDifference: number;
  entryValueUSD: number;
  currentValueUSD: number;
  tokenBalance: bigint;
}

export interface HistoryResult {
  dexResult: DexResult;
  swapRecords: TokenSwapRecord[];
}

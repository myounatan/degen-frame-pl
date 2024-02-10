# $DEGEN and $FRAME P/L Farcaster Frame

Created by **@matyounatan** on [Warpcast](https://warpcast.com/matyounatan) and [Twitter/X](https://twitter.com/matyounatan)

Built on top of [https://github.com/Zizzamia/a-frame-in-100-lines](https://github.com/Zizzamia/a-frame-in-100-lines)

## How it works

Reads Uniswap V3 subgraph for the connected Warpcast account and dynamically renders and displays token P/L and Historical swaps when requesting a frame on Farcaster.

- Must have at least 100 $DEGEN and $FRAME for results to show
- Prices are cached every minute
- Only reads the last 1000 swaps for a given token when calculating P/L data
- Only displays the last 5 swaps when viewing Swap data
- Supports all connected Warpcast addresses on an account

Published to [https://degen-frame-pl.younatan.ca/](https://degen-frame-pl.younatan.ca/)

Check it out live! [a link to the OG cast]()

## License

If you clone this repo, please credit me appropriately.

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

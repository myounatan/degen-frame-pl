# $DEGEN and $FRAME P/L Farcaster Frame

Created by **@matyounatan**

[Warpcast](https://warpcast.com/matyounatan) [Twitter/X](https://twitter.com/matyounatan) [Website](https://younatan.ca/)

Built on top of [https://github.com/Zizzamia/a-frame-in-100-lines](https://github.com/Zizzamia/a-frame-in-100-lines)
and [https://github.com/framesjs/frames.js](https://github.com/framesjs/frames.js)

## How it works

Reads Uniswap V3 subgraph for the connected Warpcast account and dynamically renders and displays token P/L and Historical swaps when requesting a frame on Farcaster.

- Calculates average purchase price from uniswap subgraph data
- Prices are cached every minute
- Only reads the last 1000 swaps for a given token when calculating P/L data
- Only displays the last 5 swaps when viewing Swap data
- Supports all connected Warpcast addresses on an account

Published to [https://degen.younatan.ca/](https://degen.younatan.ca/)

Check it out live! (Must be signed into Warpcast) [https://warpcast.com/matyounatan/0x26265d5b](https://warpcast.com/matyounatan/0x26265d5b)

## License - MIT

If you clone this repo, please credit me appropriately.

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

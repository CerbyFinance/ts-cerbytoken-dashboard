import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
import { BI_18, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInNative = Token.load("usdInNative");
  let nativeInUsd = Token.load("nativeInUsd");
  if (usdInNative === null) {
    usdInNative = new Token("usdInNative");
  }
  if (nativeInUsd === null) {
    nativeInUsd = new Token("nativeInUsd");
  }

  let wnativeReserve = ZERO_BD;
  let usdtReserve = ZERO_BD;

  wnativeReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  usdtReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  // usd in native
  if (usdtReserve > ZERO_BD) {
    usdInNative.price = wnativeReserve.div(usdtReserve);
  } else {
    usdInNative.price = ZERO_BD;
  }

  // wnative in usd
  if (wnativeReserve > ZERO_BD) {
    nativeInUsd.price = usdtReserve.div(wnativeReserve);
  } else {
    nativeInUsd.price = ZERO_BD;
  }

  nativeInUsd.save();
  usdInNative.save();
}

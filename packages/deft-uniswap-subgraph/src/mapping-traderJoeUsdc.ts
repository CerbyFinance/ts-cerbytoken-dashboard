import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

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
  let usdcReserve = ZERO_BD;

  usdcReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  wnativeReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  // usd in native
  if (usdcReserve > ZERO_BD) {
    usdInNative.price = wnativeReserve.div(usdcReserve);
  } else {
    usdInNative.price = ZERO_BD;
  }

  // wnative in usd
  if (wnativeReserve > ZERO_BD) {
    nativeInUsd.price = usdcReserve.div(wnativeReserve);
  } else {
    nativeInUsd.price = ZERO_BD;
  }

  nativeInUsd.save();
  usdInNative.save();
}

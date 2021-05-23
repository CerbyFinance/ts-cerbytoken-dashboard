import { Token } from "../generated/schema";
import { Sync } from "../generated/UniswapUsdt/UniswapPair";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let token = Token.load("usdt");

  if (token === null) {
    token = new Token("usdt");
  }

  let wethReserve = ZERO_BD;
  let usdtReserve = ZERO_BD;

  usdtReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  wethReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  if (wethReserve.notEqual(ZERO_BD)) {
    token.price = usdtReserve.div(wethReserve);
  } else {
    token.price = ZERO_BD;
  }

  token.save();
}

import { Global, Swap, Token } from "../generated/schema";
import {
  Swap as SwapEvent,
  Sync,
  Transfer,
} from "../generated/UniswapDeft/UniswapPair";
import { BI_18, convertTokenToDecimal, ZERO_BD, ZERO_BI } from "./helpers";

export function handleSync(event: Sync): void {
  let token = Token.load("deft");

  if (token === null) {
    token = new Token("deft");
  }

  let reserve0 = convertTokenToDecimal(event.params.reserve0, BI_18);
  let reserve1 = convertTokenToDecimal(event.params.reserve1, BI_18);

  if (reserve0.notEqual(ZERO_BD)) {
    token.price = reserve1.div(reserve0);
  } else {
    token.price = ZERO_BD;
  }

  token.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_18);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_18);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  // ETH/USD prices
  let usdt = Token.load("usdt");

  let feedType = "";

  if (amount1In !== ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let deftInEth = ZERO_BD;
  let amountDeft = ZERO_BD;
  let amountDeftInEth = ZERO_BD;
  if (amount1In !== ZERO_BD) {
    deftInEth = amount1In.div(amount0Out);

    amountDeft = amount0Out;
    amountDeftInEth = amount1In;
  } else if (amount1Out !== ZERO_BD) {
    deftInEth = amount1Out.div(amount0In);

    amountDeft = amount0In;
    amountDeftInEth = amount0In;
  }

  let deftInUsd = deftInEth.times(usdt.price);
  let amountDeftInUsd = amountDeftInEth.times(usdt.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInEth = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );
  let transactionFeeInUsd = transactionFeeInEth.times(usdt.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.deftInEth = deftInEth;
  swap.deftInUsd = deftInUsd;

  swap.amountDeft = amountDeft;
  swap.amountDeftInEth = amountDeftInEth;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInEth = transactionFeeInEth;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {
  if (event.params.to.toHexString() != ADDRESS_ZERO) {
    return;
  }

  let global = Global.load("1");

  if (!global) {
    global = new Global("1");
    global.totalTaxed = ZERO_BI;
  }

  global.totalTaxed = global.totalTaxed.plus(event.params.value);
  global.save();
}

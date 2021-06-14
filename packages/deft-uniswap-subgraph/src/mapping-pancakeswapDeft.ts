import {
  Swap as SwapEvent,
  Sync,
} from "../generated/PancakeswapDeft/PancakeswapPair";
import { Swap, Token } from "../generated/schema";
import { BI_18, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let deftInBnb = Token.load("deftInBnb");
  let bnbInDeft = Token.load("bnbInDeft");

  if (deftInBnb === null) {
    deftInBnb = new Token("deftInBnb");
  }
  if (bnbInDeft === null) {
    bnbInDeft = new Token("bnbInDeft");
  }

  let wbnbReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  let deftReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  // bnb in deft
  if (wbnbReserve > ZERO_BD) {
    bnbInDeft.price = deftReserve.div(wbnbReserve);
  } else {
    bnbInDeft.price = ZERO_BD;
  }

  // deft in bnb
  if (deftReserve > ZERO_BD) {
    deftInBnb.price = wbnbReserve.div(deftReserve);
  } else {
    deftInBnb.price = ZERO_BD;
  }

  let bnbInUsd = Token.load("bnbInUsd");

  let deftInUsd = Token.load("deftInUsd");

  if (deftInUsd === null) {
    deftInUsd = new Token("deftInUsd");
  }

  deftInUsd.price = deftInBnb.price.times(bnbInUsd.price);

  deftInBnb.save();
  bnbInDeft.save();
  deftInUsd.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_18);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_18);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  // BNB/USD prices
  let usdt = Token.load("bnbInUsd");

  let feedType = "";

  if (amount0In > ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let deftInBnb = ZERO_BD;
  let amountDeft = ZERO_BD;
  let amountDeftInBnb = ZERO_BD;
  if (amount1In > ZERO_BD && amount0Out > ZERO_BD) {
    deftInBnb = amount0Out.div(amount1In);

    amountDeft = amount1In;
    amountDeftInBnb = amount0Out;
  } else if (amount1Out > ZERO_BD && amount0In > ZERO_BD) {
    deftInBnb = amount0In.div(amount1Out);

    amountDeft = amount1Out;
    amountDeftInBnb = amount0In;
  }

  let deftInUsd = deftInBnb.times(usdt.price);
  let amountDeftInUsd = amountDeftInBnb.times(usdt.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInBnb = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );

  let transactionFeeInUsd = transactionFeeInBnb.times(usdt.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.deftInBnb = deftInBnb;
  swap.deftInUsd = deftInUsd;

  swap.amountDeft = amountDeft;
  swap.amountDeftInBnb = amountDeftInBnb;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInBnb = transactionFeeInBnb;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}

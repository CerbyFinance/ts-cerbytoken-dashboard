import { Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Global, Swap } from "../generated/schema";
import { Swap as SwapEvent } from "../generated/Uniswap/UniswapPair";
import { BI_10800, ONE_BI, ZERO_BI } from "./helpers";

function getOrCreateGlobal(): Global | null {
  let global = Global.load("1");

  if (global == null) {
    global = new Global("1");
    global.botsDetected = ZERO_BI;
    global.save();
  }

  return global;
}

export function handleSwap(event: SwapEvent): void {
  let input = event.transaction.input;

  // swapExactETHForTokensSupportingFeeOnTransferTokens
  // swapExactETHForTokens
  // (uint256 amountOutMin, address[] path, address to, uint256 deadline)
  // uint256,placeholder,address,uint256,size,address[n])
  // uint256,uint256,address,uint256,uint256

  let fnArgs = input.toHexString().slice(10);
  let fnAddr = input.toHexString().slice(0, 10);

  let isSupportFee = fnAddr == "0xb6f9de95";
  let isExact = fnAddr == "0x7ff36ab5";

  if (!(isSupportFee || isExact)) {
    return;
  }

  let sliced = Bytes.fromHexString("0x" + fnArgs);

  let decoded = ethereum
    .decode("(uint256,uint256,address,uint256,uint256)", sliced as Bytes)
    .toTuple();

  let amountOutMin = decoded[0].toBigInt();
  // let path = decoded[1].toArray();
  let to = decoded[2].toAddress();
  let deadline = decoded[3].toBigInt();

  let isAmountOutMinBot =
    amountOutMin.equals(ZERO_BI) || amountOutMin.equals(ONE_BI);
  let isDeadlineBot = deadline > event.block.timestamp.plus(BI_10800);

  let isBot = isAmountOutMinBot || isDeadlineBot;

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  swap.amountOutMin = amountOutMin;
  swap.isBot = isBot;
  swap.deadline = deadline;

  swap.txHash = event.transaction.hash;
  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;
  swap.timestamp = event.block.timestamp;

  swap.save();

  if (isBot) {
    let global = getOrCreateGlobal();
    global.botsDetected = global.botsDetected.plus(ONE_BI);
    global.save();
  }
}

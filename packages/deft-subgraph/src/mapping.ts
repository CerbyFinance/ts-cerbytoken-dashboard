import {
  BurnedByBridge,
  Transfer,
} from "../generated/DefiFactoryToken/DefiFactoryToken";
import { BotTransactionDetected } from "../generated/NoBotsTech/NoBotsTech";
import { BotTransaction, Global } from "../generated/schema";
import { ZERO_BI } from "./helpers";

function getOrCreateGlobal(): Global | null {
  let global = Global.load("1");

  if (!global) {
    global = new Global("1");
    global.botTaxed = ZERO_BI;
    global.userTaxed = ZERO_BI;
    global.totalTaxed = ZERO_BI;
  }

  return global;
}
export function handleBotTransactionDetected(
  event: BotTransactionDetected,
): void {
  let global = getOrCreateGlobal();

  global.botTaxed = global.botTaxed.plus(event.params.taxedAmount);
  global.userTaxed = global.totalTaxed.minus(global.botTaxed);
  global.save();

  let ts = event.block.timestamp;

  let from = event.params.from;
  let to = event.params.to;
  let taxedAmount = event.params.taxedAmount;
  let transferAmount = event.params.transferAmount;

  let botTransaction = new BotTransaction(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );
  botTransaction.timestamp = ts;
  botTransaction.from = from;
  botTransaction.to = to;
  botTransaction.taxedAmount = taxedAmount;
  botTransaction.transferAmount = transferAmount;
  botTransaction.txHash = event.transaction.hash;
  botTransaction.gasPrice = event.transaction.gasPrice;
  botTransaction.gasUsed = event.transaction.gasUsed;
  botTransaction.save();
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleBurnedByBridge(event: BurnedByBridge): void {
  let global = getOrCreateGlobal();
  global.totalTaxed = global.totalTaxed.minus(event.params.amount);
  global.userTaxed = global.totalTaxed.minus(global.botTaxed);
  global.save();
}

export function handleDefiFactoryTransfer(event: Transfer): void {
  if (event.params.to.toHexString() != ZERO_ADDRESS) {
    return;
  }

  let global = getOrCreateGlobal();

  global.totalTaxed = global.totalTaxed.plus(event.params.value);
  global.userTaxed = global.totalTaxed.minus(global.botTaxed);
  global.save();
}

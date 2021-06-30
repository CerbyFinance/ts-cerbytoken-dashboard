import { DeftTransactionService } from "../features/deft-transaction.service";
import { SYNC_TIMEOUT } from "./contract";

const deft = new DeftTransactionService();

const syncDeft = async () => {
  console.log(new Date().toLocaleString(), " ", "syncing deft transactions");
  const result = await deft.syncTransactions();
  // prettier-ignore
  console.log(new Date().toLocaleString(), " ", "synced: ", result,  " deft transactions");
};

const fire0 = async () => {
  while (true) {
    try {
      await syncDeft();
    } catch (error) {
      console.log("syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, SYNC_TIMEOUT));
  }
};

const fireAll = async () => {
  await Promise.all([fire0()]);
};

export const triggerRunJobs = () => {
  fireAll();
};

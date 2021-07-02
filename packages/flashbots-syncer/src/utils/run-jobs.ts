import { BlockTransactionsService } from "../features/blocks-transactions.service";

const blocks = new BlockTransactionsService();

const syncDeft = async () => {
  console.log(new Date().toLocaleString(), " ", "syncing blocks");
  const result = await blocks.syncBlocks();
  // prettier-ignore
  console.log(new Date().toLocaleString(), " ", "synced: ", result,  " blocks");
};

const fire0 = async () => {
  while (true) {
    try {
      await syncDeft();
    } catch (error) {
      console.log("syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 500));
  }
};

const fireAll = async () => {
  await Promise.all([fire0()]);
};

export const triggerRunJobs = () => {
  fireAll();
};

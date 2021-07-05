import PromisePool from "@supercharge/promise-pool/dist";
import { globalConfig } from "../utils/config";
import { globalMongo } from "../utils/mongo";
import { request } from "./request";
import { BlocksResult, Transaction, TransactionsResult } from "./syncer.types";

const useProxy = globalConfig.isDevelopment
  ? {
      agent: {
        // http: createAgent("http://localhost:8883"),
        // https: createAgent("http://localhost:8883"),
      },
    }
  : {};

const getLatestBlockNumber = async () => {
  const result = await request<TransactionsResult>({
    method: "GET",
    url: `https://blocks.flashbots.net/v1/transactions?limit=0`,
    ...useProxy,
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.latest_block_number;
};

const getBlocksTransactions = async (blockNumber: number) => {
  const result = await request<BlocksResult>({
    method: "GET",
    url: `https://blocks.flashbots.net/v1/blocks?block_number=${blockNumber}`,
    ...useProxy,
  });

  if (result instanceof Error) {
    return result;
  }

  const blocks = result.body.blocks;

  return blocks.length > 0 ? blocks[0].transactions : [];
};

const collectionName = "blocks-transactions";

type BlockTransactions = {
  transactions: Transaction[];
  blockNumber: number;
};

export class BlockTransactionsRepository {
  async insertMany(items: BlockTransactions[]) {
    return globalMongo.collection(collectionName).insertMany(items);
  }

  async getLastBlock() {
    const items = await globalMongo
      .collection(collectionName)
      .find<BlockTransactions>({}, {})
      .sort({ blockNumber: -1 })
      .limit(1)
      .toArray();

    return items.length > 0 ? items[0] : null;
  }

  async areFlashBots(transactions: string[]) {
    const aggregatorOpts = [
      {
        $match: {
          "transactions.transaction_hash": {
            $in: transactions,
          },
        },
      },
      {
        $project: {
          transactions: {
            $map: {
              input: {
                $filter: {
                  input: "$transactions",
                  as: "item",
                  cond: {
                    $in: ["$$item.transaction_hash", transactions],
                  },
                },
              },
              as: "item",
              in: "$$item.transaction_hash",
            },
          },
        },
      },

      { $unwind: "$transactions" },
      { $group: { _id: "transactions", res: { $addToSet: "$transactions" } } },
    ];

    const items = await globalMongo
      .collection(collectionName)
      .aggregate<{
        _id: string;
        res: string[];
      }>(aggregatorOpts)
      .toArray();

    return items.length > 0 ? items[0].res : [];
  }

  async feed(
    fromBlockNumber: number,
    toBlockNumber: number,
    limit: number,
    offset: number,
    orderBy: "ascending" | "descending",
  ) {
    const blockFilter = {
      blockNumber: {
        $gte: fromBlockNumber,
        $lte: toBlockNumber,
      },
    };

    const ordering = orderBy === "descending" ? -1 : 1;

    const aggregatorOpts = [
      {
        $match: {
          ...blockFilter,
        },
      },
      { $sort: { blockNumber: ordering } },
      { $limit: offset + limit },
      { $skip: offset },
    ];

    const items = await globalMongo
      .collection(collectionName)
      .aggregate<BlockTransactions>(aggregatorOpts)
      .toArray();

    return items;
  }
}

export class BlockTransactionsService {
  blockTransactionsRepo = new BlockTransactionsRepository();

  async syncBlocks() {
    const lastBlock = await this.blockTransactionsRepo.getLastBlock();

    const { blockNumber: lastBlockNumber } = lastBlock
      ? lastBlock
      : {
          blockNumber: 1,
        };

    const latestBlock = await getLatestBlockNumber();

    if (latestBlock instanceof Error) {
      return latestBlock;
    }

    const fromBlock = Math.max(globalConfig.startAtBlock, lastBlockNumber + 1);

    const FETCH_AT_ONCE = 50;
    const thisLatestBlock = Math.min(fromBlock + FETCH_AT_ONCE, latestBlock);

    const blocksNumbers = Array.from({
      length: thisLatestBlock - fromBlock + 1,
    }).map((_, i) => fromBlock + i);

    if (blocksNumbers.length === 0) {
      console.log("no new blocks yet");
      return 0;
    }

    console.time("timer");
    console.log("from-to: " + fromBlock + "->" + thisLatestBlock);

    // const results = await Promise.all(
    //   blocksNumbers.map(async blockNumber => {
    const { results, errors } = await PromisePool.withConcurrency(20)
      .for(blocksNumbers)
      .process(async blockNumber => {
        const transactions = await getBlocksTransactions(blockNumber);

        if (transactions instanceof Error) {
          return transactions;
        }

        return {
          blockNumber,
          transactions,
        } as BlockTransactions;
      });

    const validResults = results.filter(
      result => !(result instanceof Error),
    ) as BlockTransactions[];

    const someError = results.find(item => item instanceof Error) as Error;

    if (errors.length > 0 || results.length !== blocksNumbers.length) {
      console.log(someError);
      console.log(errors[0]);
      console.log(
        "error occured while fetching fees, check whether something went wrong",
      );
      return -1;
    }

    const sortedResults = validResults.sort(
      (left, right) => left.blockNumber - right.blockNumber,
    );

    await this.blockTransactionsRepo.insertMany(sortedResults);

    console.log("inserted blocks transactions: ", sortedResults.length);
    console.timeEnd("timer");
    return sortedResults.length;
  }
}

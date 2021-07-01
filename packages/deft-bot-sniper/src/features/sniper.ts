import _ from "lodash";
import { NonPayableTransactionObject } from "../../types/web3-v1-contracts/types";
import { globalConfig } from "../utils/config";
import {
  createAgent,
  deftStorageContract,
  globalWeb3Client,
} from "../utils/contract";
import { globalRedis } from "../utils/redis";
import { request } from "./request";

interface DeftTransaction {
  _id: string;
  isBuy: boolean;
  txHash: string;
  from: string;
  to: string;
  blockNumber: number;
  fnName: string;
  amountInMax: string;
  amountOutMin: string;
  deadline: string;
  slippage: number;
  recipients: {
    id: string;
    isNewHolder: boolean;
    isContract: boolean;
  }[];
  isBot: boolean;
  isSlippageBot: boolean;
  isDeadlineBot: boolean;
}

const DETECTOR_URL = "http://localhost:3001";

const getGasPrice = async () => {
  const result = await request<{
    code: number;
    data: {
      rapid: number;
      fast: number;
      standard: number;
      slow: number;
      timestamp: number;
    };
  }>({
    method: "get",
    url: "https://www.gasnow.org/api/v3/gas/price",
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data.fast;
};

const getTransactions = async (
  orderBy: "ascending" | "descending",
  type: "buy" | "sell" | "any",
  page: number,
  limit: number,
  fromBlockNumber: number,
  toBlockNumber: number,
) => {
  const result = await request<{
    data: DeftTransaction[];
    message: string;
    status: string;
  }>({
    method: "GET",
    url:
      DETECTOR_URL +
      `/detector/feed?orderBy=${orderBy}&type=${type}&page=${page}&limit=${limit}&fromBlockNumber=${fromBlockNumber}&toBlockNumber=${toBlockNumber}`,
    ...(globalConfig.isDevelopment
      ? {
          agent: {
            http: createAgent("http://localhost:8883"),
          },
        }
      : {}),
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const FROM_ADDRESS = globalWeb3Client.eth.accounts.wallet[0].address;
const IS_MAIN = false;

const ESTIMATE_MULT = 1.2;
const SPLIT_BY = 50;

const sendTransaction = async (
  generateMethod: () => NonPayableTransactionObject<void>,
) => {
  const gasPrice = IS_MAIN
    ? await getGasPrice()
    : await globalWeb3Client.eth.getGasPrice();

  const preparedMethod = generateMethod();

  const estimatedGas = await preparedMethod.estimateGas({
    from: FROM_ADDRESS,
  });

  const callGas = Math.floor(estimatedGas * ESTIMATE_MULT);

  const result = preparedMethod.send({
    from: FROM_ADDRESS,
    gas: callGas,
    gasPrice: Number(gasPrice) + 1,
  });

  const transactionHash = await new Promise<string>(resolve => {
    result.once("transactionHash", hash => resolve(hash));
  });

  return {
    transactionHash,
    pendingTx: result,
  };
};

const log = (input: string) => {
  console.log(new Date().toLocaleString(), " ", input);
};

export const snipe = async (transactions: DeftTransaction[]) => {
  const possibleUniqHumans = _.uniq(
    transactions.filter(tx => tx.fnName === "unknown").map(tx => tx.to),
  );
  const humansFromContract = await deftStorageContract.methods
    .isMarkedAsHumanStorageBulk(possibleUniqHumans)
    .call({
      from: FROM_ADDRESS,
    });
  const humansForUnknownSet = new Set(humansFromContract);

  const possibleBots = transactions.flatMap(tx => {
    const to = tx.to;
    const recipients = tx.recipients;

    if (tx.fnName === "unknown") {
      const isHuman = humansForUnknownSet.has(to);
      if (isHuman) {
        return [];
      }
    }

    if (tx.isBot) {
      return recipients;
    }

    return [];
  });

  const possibleUniqBots = _.uniq(
    possibleBots
      .filter(r => r.id !== ZERO_ADDRESS && !r.isContract && r.isNewHolder)
      .map(r => r.id),
  );

  const botsFromContract = await deftStorageContract.methods
    .isMarkedAsBotStorageBulk(possibleUniqBots)
    .call({
      from: FROM_ADDRESS,
    });

  const botsSet = new Set(botsFromContract);

  // ignore existing bots
  const botsToMark = possibleUniqBots.filter(bot => !botsSet.has(bot));

  log("bots to snipe: " + botsToMark.length);

  // split by 50
  const chunkedBotsToMark = _.chunk(botsToMark, SPLIT_BY);

  for (const botsToMark of chunkedBotsToMark) {
    if (botsToMark.length > 0) {
      const { pendingTx, transactionHash } = await sendTransaction(() => {
        if (botsToMark.length === 1) {
          return deftStorageContract.methods.markAddressAsBot(botsToMark[0]);
        }

        return deftStorageContract.methods.bulkMarkAddressAsBot(botsToMark);
      });
      log("processing tx: " + transactionHash);
      const txResult = await pendingTx;
      if (!txResult.status) {
        log("it's not approved for some reason");
        return false;
      }
      log("bots detected and sniped: " + botsToMark.length);
    }
  }

  return true;
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const sniperLoop = async () => {
  let once = false;
  while (true) {
    await sleep(once ? globalConfig.snipeTimeout * 1000 : 0);
    once = true;

    try {
      const latestBlockNumber = await globalRedis
        .get("latest_block_number")
        .then(some => (some ? Number(some) : null));

      if (!latestBlockNumber) {
        log("!!! block undefined !!!");
        return;
      }

      const headBlockNumber = await globalWeb3Client.eth.getBlockNumber();

      log("latest block number: " + latestBlockNumber);
      log("head block number: " + headBlockNumber);

      // TODO: pages till empty  (not necessary)
      const transactions = await getTransactions(
        "ascending",
        "buy",
        1,
        1000,
        latestBlockNumber + 1,
        headBlockNumber,
      );

      if (transactions instanceof Error) {
        log(transactions.message);
        continue;
      }

      if (transactions.length === 0) {
        log("no new transaction yet");
        continue;
      }

      const maxBlockNumber = Math.max(
        ...transactions.map(item => item.blockNumber),
      );

      let isOk = false;
      try {
        isOk = await snipe(transactions);
      } catch (error) {
        log(error.message);
        continue;
      }

      if (!isOk) {
        continue;
      }

      await globalRedis.set("latest_block_number", maxBlockNumber);
    } catch (error) {
      log("things happen");
      console.log(error);
    }
  }
};

export const triggerRunJobs = () => {
  sniperLoop();
  // snipe();
};

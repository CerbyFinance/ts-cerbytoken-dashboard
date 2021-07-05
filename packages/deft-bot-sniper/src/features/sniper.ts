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

const DETECTOR_URL = "http://localhost:3002";

// TODO: !!!
const FLASHBOTS_URL = "http://localhost:3001";

const getBlockNumber = async () => {
  const result = await request<{
    message: string;
    data: number;
  }>({
    method: "GET",
    url: `${FLASHBOTS_URL}/flashbots/last-block`,
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

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

  return result.body.data.rapid;
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
    method: "POST",
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
    json: {
      toIn: [],
      recipientsIn: [],
    },
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DEAD_ADDRESS = "0xdEad000000000000000000000000000000000000";
const FROM_ADDRESS = globalWeb3Client.eth.accounts.wallet[0].address;
const IS_MAIN = !globalConfig.isDevelopment;

const ESTIMATE_MULT = 1.2;
const SPLIT_BY = 50;

const sendTransaction = async (
  generateMethod: () => NonPayableTransactionObject<void>,
) => {
  const _gasPrice = IS_MAIN
    ? await getGasPrice()
    : await globalWeb3Client.eth.getGasPrice();

  if (_gasPrice instanceof Error) {
    return _gasPrice;
  }

  const gasPrice = Math.min(Number(_gasPrice), 10000000000);

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

const l = (s: string) => s.toLowerCase();

const snipe = async (transactions: DeftTransaction[]) => {
  const possibleBots = transactions.flatMap(tx => {
    const recipients = tx.recipients;

    if (tx.isBot) {
      return recipients;
    }

    return [];
  });

  const possibleUniqBots = _.uniq(
    possibleBots
      .filter(
        r =>
          l(r.id) !== l(ZERO_ADDRESS) &&
          l(r.id) !== l(DEAD_ADDRESS) &&
          !r.isContract &&
          r.isNewHolder,
      )
      .map(r => r.id.toLowerCase()),
  );

  const botsFromContract = await deftStorageContract.methods
    .isMarkedAsBotStorageBulk(possibleUniqBots)
    .call({
      from: FROM_ADDRESS,
    });

  const botsSet = new Set(botsFromContract.map(item => item.toLowerCase()));

  // ignore existing bots
  const botsToMark = possibleUniqBots
    .filter(bot => !botsSet.has(bot))
    .map(item => item.toLowerCase());

  log("bots to snipe: " + botsToMark.length);

  // split by 50
  const chunkedBotsToMark = _.chunk(botsToMark, SPLIT_BY);

  for (const botsToMark of chunkedBotsToMark) {
    if (botsToMark.length > 0) {
      const transactionRes = await sendTransaction(() => {
        if (botsToMark.length === 1) {
          return deftStorageContract.methods.markAddressAsBot(botsToMark[0]);
        }

        return deftStorageContract.methods.bulkMarkAddressAsBot(botsToMark);
      });

      if (transactionRes instanceof Error) {
        log(transactionRes.message);
        return false;
      }

      const { pendingTx, transactionHash } = transactionRes;

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

export const sniperLoop = async () => {
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

      const headBlockNumber = await getBlockNumber();

      if (headBlockNumber instanceof Error) {
        return headBlockNumber;
      }
      // const headBlockNumber = await globalWeb3Client.eth.getBlockNumber();

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

      try {
        const isOk = await snipe(transactions);

        if (!isOk) {
          continue;
        }
      } catch (error) {
        log(error.message);
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
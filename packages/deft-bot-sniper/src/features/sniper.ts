import _ from "lodash";
import { NonPayableTransactionObject } from "../../types/web3-v1-contracts/types";
import { globalConfig } from "../utils/config";
import {
  createAgent,
  deftStorageContract,
  globalWeb3Client,
} from "../utils/contract";
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

const ESTIMATE_MULT = 3;

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

export const sniper = async () => {
  // const fromBlockNumber = 1;
  // const toBlockNumber = await globalWeb3Client.eth.getBlockNumber();
  const fromBlockNumber = 12495074;
  const toBlockNumber = 12498074;

  // TODO: pages till empty
  const transactions = await getTransactions(
    "ascending",
    "buy",
    1,
    100,
    fromBlockNumber,
    toBlockNumber,
  );

  // TODO: including all pages
  const maxBlockNumber = 111;

  if (transactions instanceof Error) {
    return transactions;
  }

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

  // split by 50
  const chunkedBotsToMark = _.chunk(botsToMark, 50);

  for (const botsToMark of chunkedBotsToMark) {
    if (botsToMark.length > 0) {
      console.log("sending transaction");
      const { pendingTx, transactionHash } = await sendTransaction(() => {
        return deftStorageContract.methods.bulkMarkAddressAsBot(botsToMark);
      });
      console.log(transactionHash);
      const txResult = await pendingTx;
      console.log("bots detected and sniped: ", botsToMark.length);
      // TODO: update max block
    }
  }
};

export const triggerRunJobs = () => {
  sniper();
};

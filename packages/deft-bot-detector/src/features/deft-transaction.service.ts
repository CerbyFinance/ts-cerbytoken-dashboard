import _ from "lodash";
import Web3 from "web3";
import { Log } from "web3-core";
import { Swap, Transfer } from "../../types/web3-v1-contracts/UniswapPair";
import uniswapV2Router from "../contracts/UniswapV2Router.json";
import { globalConfig } from "../utils/config";
import {
  deftTokenContract,
  DEFT_TOKEN,
  DEFT_UNISWAP_PAIR,
  DEFT_UNISWAP_PAIR_START_BLOCK,
  globalSecondaryWeb3Client,
  globalWeb3Client,
  isContractBulkContract,
  uniswapPairContract,
  uniswapPairContractAbi,
  WETH_TOKEN,
} from "../utils/contract";
import { globalMongo } from "../utils/mongo";
import { globalRedis } from "../utils/redis";
import {
  computeFnHash,
  createGetAbi,
  decodeLog,
  EventDoc,
  getPastLogs,
} from "../utils/web3.utils";
import { request } from "./request";

const SWAP_EVENT_HASH =
  "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822";

const decodeByFnHash = Object.fromEntries(
  uniswapV2Router
    .filter(item => (item.name || "").startsWith("swap"))
    .map(item => {
      const name = item.name!;
      const inputs = item.inputs!;

      const fnHash = computeFnHash(name, inputs)!.slice(0, 10);

      const decode = (input: string) => {
        return globalWeb3Client.eth.abi.decodeParameters(inputs, input);
      };

      return [
        fnHash,
        {
          decode,
          fnHash,
          fnName: name,
        },
      ];
    }),
);

export interface DeftTransaction {
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

const collectionName = "deft-transactions";

const areFlashBots = async (transactions: string[]) => {
  const result = await request<{
    data: string[];
    message: string;
  }>({
    method: "POST",
    url: `${globalConfig.flashBotsUrl}/flashbots/are-flash-bots`,
    json: {
      transactions,
    },
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

const areOffChainBots = async (addresses: string[]) => {
  const result = await request<{
    data: string[];
    message: string;
  }>({
    method: "POST",
    url: `${globalConfig.offChainStorageUrl}/storage/are-bots`,
    json: {
      addresses,
    },
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export const withOffChainBots = async (transactions: DeftTransaction[]) => {
  // prettier-ignore
  const addresses = transactions.flatMap(item =>
    item.recipients
      .filter(recip => recip.id !== ZERO_ADDR && recip.isNewHolder && !recip.isContract)
      .map(recip => recip.id),
  );

  const bots =
    addresses.length > 0
      ? await areOffChainBots(addresses).then(r => {
          if (r instanceof Error) {
            console.log(r);
            return [];
          }

          return r;
        })
      : [];

  const botsSet = new Set(bots);

  const result = transactions.map(item => {
    // prettier-ignore
    const theseRecipients = item.recipients
      .filter(recip =>  recip.id !== ZERO_ADDR && recip.isNewHolder && !recip.isContract)
      .map(recip => recip.id);

    const isBotInDB = theseRecipients.some(recip => botsSet.has(recip));
    return {
      ...item,
      isBotInDB,
      isBot: isBotInDB ? true : item.isBot,
    } as DeftTransaction & { isBotInDB: true };
  });

  return result;
};

export const withFlashBots = async (transactions: DeftTransaction[]) => {
  const txsHashes = transactions.map(item => item.txHash);

  const flashbots = await areFlashBots(txsHashes).then(r => {
    if (r instanceof Error) {
      console.log(r);
      return [];
    }

    return r;
  });

  const flasbotsSet = new Set(flashbots);

  const resultWithFlashbots = transactions.map(item => {
    const isFlashBot = flasbotsSet.has(item.txHash);
    return {
      ...item,
      isFlashBot,
      isBot: isFlashBot ? true : item.isBot,
    } as DeftTransaction & { isFlashBot: true };
  });

  return resultWithFlashbots;
};

export class DeftTransactionRepository {
  async insertMany(items: DeftTransaction[]) {
    return globalMongo.collection(collectionName).insertMany(items);
  }

  async getLastTransaction() {
    const items = await globalMongo
      .collection(collectionName)
      .find<DeftTransaction>({}, {})
      .sort({ blockNumber: -1 })
      .limit(1)
      .toArray();

    return items.length > 0 ? items[0] : null;
  }

  async feed<T extends "buy" | "sell" | "any">(
    fromBlockNumber: number,
    toBlockNumber: number,
    limit: number,
    offset: number,
    type: T,
    orderBy: "ascending" | "descending",
    toIn: string[],
    recipientsIn: string[],
  ) {
    const blockFilter = {
      blockNumber: {
        $gte: fromBlockNumber,
        $lte: toBlockNumber,
      },
      ...(toIn.length > 0
        ? {
            to: {
              $in: toIn,
            },
          }
        : {}),
      ...(recipientsIn.length > 0
        ? {
            "recipients.id": {
              $in: recipientsIn,
            },
          }
        : {}),
    };

    const mapTo = {
      buy: {
        isBuy: true,
      },
      sell: {
        isBuy: false,
      },
      any: {},
    };

    const filterBy = mapTo[type] ? mapTo[type] : mapTo["any"];

    const ordering = orderBy === "descending" ? -1 : 1;

    const aggregatorOpts = [
      {
        $match: {
          ...filterBy,
          ...blockFilter,
        },
      },
      { $sort: { blockNumber: ordering } },
      { $limit: offset + limit },
      { $skip: offset },
    ];

    const items = await globalMongo
      .collection(collectionName)
      .aggregate<DeftTransaction>(aggregatorOpts)
      .toArray();

    return items;
  }
}

const l = (s: string) => s.toLowerCase();

let CHAIN_ID = 0;

const getChainId = async () => {
  if (!CHAIN_ID) {
    CHAIN_ID = await globalWeb3Client.eth.getChainId();
    return CHAIN_ID;
  }

  return CHAIN_ID;
};

export class DeftTransactionService {
  deftTransactionRepo = new DeftTransactionRepository();

  async getTokens(address: string) {
    const chainId = await getChainId();

    const KEY = chainId + "-" + address;

    let tokens = await globalRedis.get(KEY);

    if (!tokens) {
      let pairContract = uniswapPairContract(address);

      const [token0, token1] = await Promise.all([
        pairContract.methods.token0().call(),
        pairContract.methods.token1().call(),
      ]);

      const tokens = [token0, token1];
      await globalRedis.set(KEY, JSON.stringify(tokens));

      return tokens;
    }

    return JSON.parse(tokens!) as [string, string];
  }

  async syncTransactions() {
    const lastTx = await this.deftTransactionRepo.getLastTransaction();

    const { _id: lastItemId, blockNumber: lastBlockNumber } = lastTx
      ? lastTx
      : {
          _id: "",
          blockNumber: 1,
        };

    const latestBlock = await globalWeb3Client.eth.getBlockNumber();

    const fromBlock = Math.max(
      DEFT_UNISWAP_PAIR_START_BLOCK,
      lastBlockNumber + 1,
    );

    const thisLatestBlock =
      globalConfig.fetchAtOnce === -1
        ? latestBlock
        : Math.min(fromBlock + globalConfig.fetchAtOnce, latestBlock);

    // const thisLatestBlock = latestBlock;

    const web3 = globalWeb3Client;
    const secondaryWeb3 = globalSecondaryWeb3Client;

    const newEvents = await getPastLogs(
      web3,
      DEFT_UNISWAP_PAIR,
      fromBlock,
      thisLatestBlock,
      [SWAP_EVENT_HASH],
    );

    const newEventsNoDups = newEvents;

    console.log("checking bots");

    // @ts-ignore
    const getAbi = createGetAbi(uniswapPairContractAbi);
    const chunked = _.chunk(newEventsNoDups, 100) as Log[][];

    let i = 0;
    let j = 0;
    for (const items of chunked) {
      // prettier-ignore
      const newItems = items.map(item => decodeLog(web3, item, getAbi));

      // preserve order
      const results = await Promise.all(
        newItems
          .map(async event => {
            // const { results, errors } = await PromisePool.withConcurrency(10)
            //   .for(newItems)
            //   .process(async event => {
            const transactionHash = event.transactionHash;
            const blockNumber = event.blockNumber;

            const [
              { timestamp },
              { input, value, hash: txHash, gasPrice },
              { from, to, logs },
            ] = await Promise.all([
              globalWeb3Client.eth.getBlock(blockNumber),
              globalWeb3Client.eth.getTransaction(transactionHash),
              globalWeb3Client.eth.getTransactionReceipt(transactionHash),
            ]);

            const decodedLogs = logs.map(item => decodeLog(web3, item, getAbi));

            const transfers = decodedLogs.filter(
              item => item.eventName === "Transfer",
            ) as EventDoc<Transfer, any>[];

            const swaps = decodedLogs.filter(
              item => item.eventName === "Swap",
            ) as EventDoc<Swap, any>[];

            const zero = {
              amount0In: "0",
              amount1In: "0",
              amount0Out: "0",
              amount1Out: "0",
            };

            const firstSwap = swaps
              ? swaps[0]
              : {
                  decoded: zero,
                  address: "",
                };

            const latestSwap = swaps
              ? swaps[swaps.length - 1]
              : {
                  decoded: zero,
                  address: "",
                };

            const amount0In = firstSwap.decoded.amount0In;
            const amount1In = firstSwap.decoded.amount1In;

            const amount0Out = latestSwap.decoded.amount0Out;
            const amount1Out = latestSwap.decoded.amount1Out;

            const [token0, token1] = latestSwap.address
              ? await this.getTokens(latestSwap.address)
              : ["", ""];

            const amount1InGt1 = Web3.utils
              .toBN(latestSwap.decoded.amount1In)
              .gt(Web3.utils.toBN(1));

            const amount0InGt1 = Web3.utils
              .toBN(latestSwap.decoded.amount0In)
              .gt(Web3.utils.toBN(1));

            const statement1 =
              l(DEFT_TOKEN) < l(WETH_TOKEN) &&
              l(token0) == l(DEFT_TOKEN) &&
              l(token1) == l(WETH_TOKEN) &&
              amount1InGt1;

            const statement2 =
              l(DEFT_TOKEN) > l(WETH_TOKEN) &&
              l(token0) == l(WETH_TOKEN) &&
              l(token1) == l(DEFT_TOKEN) &&
              amount0InGt1;

            const isBuy = latestSwap.address ? statement1 || statement2 : false;

            const recipients = transfers.map(item => item.decoded.to);
            const recipientsBalancesBefore = await Promise.all(
              recipients.map(async item => {
                try {
                  const balance = await deftTokenContract(web3)
                    .methods.balanceOf(item)
                    .call({}, blockNumber - 1);
                  return balance;
                } catch (error) {}

                // fallback
                const balance = await deftTokenContract(secondaryWeb3)
                  .methods.balanceOf(item)
                  .call({}, blockNumber - 1);

                return balance;
              }),
            );

            const isContractBulkResult = await isContractBulkContract.methods
              .removeIsContractBulk(recipients)
              .call();

            const realRecipients = _.zipWith(
              recipients,
              recipientsBalancesBefore,
              isContractBulkResult,
              (recipient, balanceBefore, self) => {
                const isNotContract = recipient === self;
                const isNewHolder = balanceBefore === "0";
                return {
                  id: recipient,
                  isNewHolder,
                  isContract: !isNotContract,
                };
              },
            );

            const fnArgs = input.slice(10);
            const fnAddr = input.slice(0, 10);

            const sliced = "0x" + fnArgs;

            const decode = decodeByFnHash[fnAddr];

            const ZERO_BI = Web3.utils.toBN("0");

            let amountInMax = ZERO_BI;
            let amountOutMin = ZERO_BI;
            let deadline = ZERO_BI;

            const fnName = decode ? decode.fnName : "unknown";
            const decoded = decode ? decode.decode(sliced) : {};

            // prettier-ignore
            if (fnName === 'swapETHForExactTokens') {
            amountInMax = Web3.utils.toBN(value)
            amountOutMin = ZERO_BI;
            deadline = Web3.utils.toBN(decoded['deadline'])
          } else if (fnName === 'swapExactETHForTokens') {
            amountInMax = ZERO_BI;
            amountOutMin = Web3.utils.toBN(decoded['amountOutMin'])
            deadline = Web3.utils.toBN(decoded['deadline'])
          } else if (fnName === 'swapExactETHForTokensSupportingFeeOnTransferTokens') {
            amountInMax = ZERO_BI;
            amountOutMin = Web3.utils.toBN(decoded['amountOutMin'])
            deadline = Web3.utils.toBN(decoded['deadline'])
          } else if (fnName === 'swapExactTokensForETH') {
            //
          } else if (fnName === 'swapExactTokensForETHSupportingFeeOnTransferTokens') {
            //
          } else if (fnName === 'swapExactTokensForTokens') {
            amountInMax = ZERO_BI;
            amountOutMin = Web3.utils.toBN(decoded['amountOutMin'])
            deadline = Web3.utils.toBN(decoded['deadline'])
          } else if (fnName === 'swapExactTokensForTokensSupportingFeeOnTransferTokens') {
            amountInMax = ZERO_BI;
            amountOutMin = Web3.utils.toBN(decoded['amountOutMin'])
            deadline = Web3.utils.toBN(decoded['deadline'])
          } else if (fnName === 'swapTokensForExactETH') {
            //
          } else if (fnName === 'swapTokensForExactTokens') {
            amountInMax =  Web3.utils.toBN(decoded['amountInMax']);
            amountOutMin = ZERO_BI;
            deadline = Web3.utils.toBN(decoded['deadline'])
          }

            const amountIn =
              l(WETH_TOKEN) < l(DEFT_TOKEN)
                ? Web3.utils.toBN(amount0In)
                : Web3.utils.toBN(amount1In);

            const amountOut =
              l(WETH_TOKEN) < l(DEFT_TOKEN)
                ? Web3.utils.toBN(amount1Out)
                : Web3.utils.toBN(amount0Out);

            const num1 = Number(Web3.utils.fromWei(amountInMax));
            const deNom1 = Number(Web3.utils.fromWei(amountIn));

            const slippagePercentIn =
              num1 > 0 ? Math.abs((num1 - deNom1) / num1) : 1;

            const num2 = Number(web3.utils.fromWei(amountOut));
            const deNom2 = Number(web3.utils.fromWei(amountOutMin));

            const slippagePercentOut = Math.abs((num2 - deNom2) / num2);

            const slippage =
              fnName === "unknown"
                ? 0
                : slippagePercentIn + slippagePercentOut - 1;

            const isSlippageBot = slippage > 0.5101;
            const isDeadlineBot =
              deadline > Web3.utils.toBN(timestamp).addn(12000);

            const isGweiZero = Web3.utils.toBN(gasPrice).eqn(0);

            const isBot = isSlippageBot || isDeadlineBot || isGweiZero;

            return {
              _id: event._id,

              isBuy,

              txHash,
              from,
              to,
              blockNumber: event.blockNumber,

              fnName,
              amountInMax: amountInMax.toString(),
              amountOutMin: amountOutMin.toString(),

              amountIn: amountIn.toString(),
              amountOut: amountOut.toString(),

              deadline: deadline.toString(),
              slippage,

              recipients: realRecipients,

              isBot,
              isSlippageBot,
              isDeadlineBot,
              isGweiZero,
            } as DeftTransaction;
          })
          .map(promise => promise.catch(error => error as Error)),
      );

      const validResults = results.filter(
        result => !(result instanceof Error),
      ) as DeftTransaction[];

      const someError = results.find(item => item instanceof Error) as Error;

      if (someError) {
        console.log(someError);
        console.log(
          "error occured while fetching transactions, check whether something went wrong",
        );

        return -1;
      }

      console.log("fetching flashbots and off-chain bots");
      console.time("flashbots");

      const resultWithFlashBots = globalConfig.syncTimeFlashBots
        ? await withFlashBots(validResults)
        : validResults;

      const resultWithOffChainBots = globalConfig.syncTimeOffChainStorage
        ? await withOffChainBots(resultWithFlashBots)
        : resultWithFlashBots;

      console.timeEnd("flashbots");

      await this.deftTransactionRepo.insertMany(resultWithOffChainBots);

      i += items.length;
      j += results.length;
      console.log("inserted deft transactions: ", i, " ", j);
    }

    return j;
  }
}

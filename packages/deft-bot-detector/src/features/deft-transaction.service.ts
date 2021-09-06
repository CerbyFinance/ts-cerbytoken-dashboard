import BN from "bn.js";
import DataLoader from "dataloader";
import _ from "lodash";
import Web3 from "web3";
import { Swap, Transfer } from "../../types/web3-v1-contracts/UniswapPair";
import uniswapV2Router from "../contracts/UniswapV2Router.json";
import { globalConfig } from "../utils/config";
import {
  deftStorageContract,
  DEFT_TOKEN,
  DEFT_TOKEN_START_BLOCK,
  DEFT_UNISWAP_PAIR,
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

// const SWAP_EVENT_HASH =
//   "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822";

const TRANSFER_EVENT_HASH =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

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
  token: string;
  chainId: number;
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

interface TokenState {
  token: string;
  chainId: number;
  blockNumber: number;
  holders: string[];
}

export class DeftTokenStateRepository {
  collectionName = "token-state";

  async findState(chainId: number) {
    return globalMongo.collection(this.collectionName).findOne<TokenState>({
      token: DEFT_TOKEN,
      chainId,
    });
  }

  async updateState(chainId: number, blockNumber: number, holders: string[]) {
    return globalMongo.collection(this.collectionName).updateOne(
      {
        token: DEFT_TOKEN,
        chainId,
      },
      {
        $set: {
          blockNumber,
        },
        $addToSet: { holders: { $each: holders } },
      },
      { upsert: true },
    );
  }
}

export class DeftTransactionRepository {
  collectionName = "transactions";

  async insertMany(items: DeftTransaction[]) {
    return globalMongo.collection(this.collectionName).insertMany(items);
  }

  async _getLastTransaction() {
    const items = await globalMongo
      .collection(this.collectionName)
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
    chainId: number | undefined,
    token: string | undefined,
    fnName: string | undefined,
    isBot: boolean | undefined,
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
      ...(chainId ? { chainId: Number(chainId) } : {}),
      ...(token ? { token } : {}),
      ...(fnName ? { fnName } : {}),
      ...(typeof isBot === "boolean" ? { isBot } : {}),
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
      .collection(this.collectionName)
      .aggregate<DeftTransaction>(aggregatorOpts, {
        collation: {
          locale: "en_US",
          strength: 1,
        },
      })
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

const computeSlippage = (
  {
    amount0In,
    amount1In,
    amount1Out,
    amount0Out,
    amountInMax,
    amountOutMin,
  }: {
    amount0In: string;
    amount1In: string;
    amount1Out: string;
    amount0Out: string;
    amountInMax: BN;
    amountOutMin: BN;
  },
  directionCondition: boolean,
) => {
  const amountIn = directionCondition
    ? Web3.utils.toBN(amount0In)
    : Web3.utils.toBN(amount1In);

  const amountOut = directionCondition
    ? Web3.utils.toBN(amount1Out)
    : Web3.utils.toBN(amount0Out);

  const num1 = Number(Web3.utils.fromWei(amountInMax));
  const deNom1 = Number(Web3.utils.fromWei(amountIn));

  const slippagePercentIn = num1 > 0 ? Math.abs((num1 - deNom1) / num1) : 1;

  const num2 = Number(Web3.utils.fromWei(amountOut));
  const deNom2 = Number(Web3.utils.fromWei(amountOutMin));

  const slippagePercentOut = Math.abs((num2 - deNom2) / num2);

  const slippage = slippagePercentIn + slippagePercentOut - 1;

  return {
    value: slippage,
    amountIn,
    amountOut,
  };
};

const firstAndLatestSwaps = (swaps: EventDoc<Swap, any>[]) => {
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

  return {
    firstSwap,
    latestSwap,
  };
};

const amountsFromSwaps = (swaps: EventDoc<Swap, any>[]) => {
  const { firstSwap, latestSwap } = firstAndLatestSwaps(swaps);

  const amount0In = firstSwap.decoded.amount0In;
  const amount1In = firstSwap.decoded.amount1In;

  const amount0Out = latestSwap.decoded.amount0Out;
  const amount1Out = latestSwap.decoded.amount1Out;

  return {
    amount0In,
    amount1In,

    amount0Out,
    amount1Out,
  };
};

export class DeftTransactionService {
  deftTransactionRepo = new DeftTransactionRepository();
  deftTokenStateRepo = new DeftTokenStateRepository();

  async getTokens(address: string) {
    const chainId = await getChainId();

    const KEY = "token" + "-" + chainId + "-" + address;

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
    const chainId = await getChainId();
    // const lastTx = await this.deftTransactionRepo.getLastTransaction();
    const state =
      (await this.deftTokenStateRepo.findState(chainId)) ||
      ({
        chainId,
        blockNumber: 0,
        holders: [],
        token: DEFT_TOKEN,
      } as TokenState);

    // const { _id: lastItemId, blockNumber: lastTxBlockNumber } = lastTx
    //   ? lastTx
    //   : {
    //       _id: "",
    //       blockNumber: 1,
    //     };

    const lastBlockNumber = state.blockNumber;

    const latestBlock = await globalWeb3Client.eth.getBlockNumber();

    const fromBlock = Math.max(DEFT_TOKEN_START_BLOCK, lastBlockNumber + 1);

    const thisLatestBlock =
      globalConfig.fetchAtOnce === -1
        ? latestBlock
        : Math.min(fromBlock + globalConfig.fetchAtOnce, latestBlock);

    const web3 = globalWeb3Client;

    const newEvents = await getPastLogs(
      web3,
      DEFT_TOKEN,
      fromBlock,
      thisLatestBlock,
      [TRANSFER_EVENT_HASH],
    );

    const holdersFromStorage = new Set(state.holders);

    // @ts-ignore
    const getAbi = createGetAbi(uniswapPairContractAbi);

    const newDecodedEvents = newEvents.map(item =>
      decodeLog(web3, item, getAbi),
    ) as EventDoc<Transfer, any>[];

    // precomputing holders below
    const holdersByBlock = newDecodedEvents
      .map(item => [item.blockNumber, item.decoded.to] as [number, string])
      .reduce(
        (acc, val) => {
          const [blockNumber, to] = val;
          if (!acc[blockNumber]) {
            acc[blockNumber] = new Set<string>();
          }
          const set = acc[blockNumber];
          set.add(to.toLowerCase());
          return acc;
        },
        {} as {
          [blockNumber: number]: Set<string>;
        },
      );

    const blocks = Object.keys(holdersByBlock).map(item => Number(item));
    blocks.sort(); // mutated in place, asc sort

    const isHolder = (blockNumber: number, holder: string) => {
      const blocksToTravel = _.dropRightWhile(blocks, b => b > blockNumber);
      const isHolderFromTravel = blocksToTravel.some(block =>
        holdersByBlock[block].has(holder),
      );

      if (!isHolderFromTravel) {
        return holdersFromStorage.has(holder);
      }

      return isHolderFromTravel;
    };

    const newUniqueDecodedEvents = _.uniqWith(
      newDecodedEvents,
      (a, b) => a.transactionHash === b.transactionHash,
    );

    // TODO: maybe process multiple blocks (?)
    // right now only unique transactions
    const chunked = _.chunk(newUniqueDecodedEvents, 100);

    // TODO: transform to batches
    const blockLoader = new DataLoader((keys: readonly number[]) => {
      return Promise.all(keys.map(key => globalWeb3Client.eth.getBlock(key)));
    });
    const transactionLoader = new DataLoader((keys: readonly string[]) => {
      return Promise.all(
        keys.map(key => globalWeb3Client.eth.getTransaction(key)),
      );
    });
    const transactionReceiptLoader = new DataLoader(
      (keys: readonly string[]) => {
        return Promise.all(
          keys.map(key => globalWeb3Client.eth.getTransactionReceipt(key)),
        );
      },
    );
    const removeIsContractBulkLoader = new DataLoader(
      (keys: readonly string[]) => {
        return isContractBulkContract.methods
          .removeIsContractBulk(keys as string[])
          .call();
      },
    );

    const isMarkedAsHumanStorageBulkLoader = new DataLoader(
      (keys: readonly string[]) => {
        return deftStorageContract.methods
          .isMarkedAsHumanStorageBulk(keys as string[])
          .call();
      },
    );

    // to get rid of "pits"
    if (newEvents.length === 0) {
      await this.deftTokenStateRepo.updateState(chainId, thisLatestBlock, []);
    }

    let i = 0;
    let j = 0;
    for (const items of chunked) {
      // preserve order
      const results = await Promise.all(
        items
          .map(async event => {
            // const { results, errors } = await PromisePool.withConcurrency(10)
            //   .for(newItems)
            //   .process(async event => {
            const transactionHash = event.transactionHash;
            const blockNumber = event.blockNumber;

            const [
              // { timestamp },
              // { input, value, hash: txHash, gasPrice },
              { from, to, logs },
            ] = await Promise.all([
              // blockLoader.load(blockNumber),
              // transactionLoader.load(transactionHash),
              transactionReceiptLoader.load(transactionHash),
            ]);

            const decodedLogs = logs.map(item => decodeLog(web3, item, getAbi));

            const transfers = decodedLogs.filter(
              item =>
                item.eventName === "Transfer" &&
                l(item.address) === l(DEFT_TOKEN),
            ) as EventDoc<Transfer, any>[];

            const recipients = transfers.map(item => item.decoded.to);

            const allSwaps = decodedLogs.filter(
              item => item.eventName === "Swap",
            ) as EventDoc<Swap, any>[];

            const deftSwaps = decodedLogs.filter(
              item =>
                item.eventName === "Swap" &&
                l(item.address) === l(DEFT_UNISWAP_PAIR),
            ) as EventDoc<Swap, any>[];

            if (deftSwaps.length === 0) {
              return null;
            }

            const { firstSwap, latestSwap } = firstAndLatestSwaps(deftSwaps);

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

            if (!isBuy) {
              return null;
            }

            const [{ timestamp }, { input, value, hash: txHash, gasPrice }] =
              await Promise.all([
                blockLoader.load(blockNumber),
                transactionLoader.load(transactionHash),
              ]);

            const areRecipientsHoldersBefore = recipients.map(item =>
              isHolder(blockNumber - 1, item),
            );

            const isContractBulkResult =
              await removeIsContractBulkLoader.loadMany(recipients);

            const realRecipients = _.zipWith(
              recipients,
              areRecipientsHoldersBefore,
              isContractBulkResult,
              (recipient, isHolder, self) => {
                const isNotContract = recipient === self;
                const isNewHolder = !isHolder;
                return {
                  id: recipient,
                  isNewHolder,
                  isContract: !isNotContract,
                  isOrigin: l(recipient) === l(from),
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

            const isToHumanAddr = await isMarkedAsHumanStorageBulkLoader.load(
              to,
            );
            const isToHuman = l(isToHumanAddr) === to;
            const isProxy = fnName === "unknown" && !isToHuman;

            let handleCritical = false;
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
              handleCritical=  true
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
              handleCritical = true
            }

            const allSwapsAmounts = amountsFromSwaps(allSwaps);
            const deftSwapsAmounts = amountsFromSwaps(deftSwaps);

            const [slippage1, slippage2] = handleCritical
              ? [true, false].map(cond =>
                  computeSlippage(
                    {
                      ...allSwapsAmounts,
                      amountInMax,
                      amountOutMin,
                    },
                    cond,
                  ),
                )
              : [
                  computeSlippage(
                    { ...deftSwapsAmounts, amountInMax, amountOutMin },
                    l(WETH_TOKEN) < l(DEFT_TOKEN),
                  ),
                  {
                    value: -1,
                    amountIn: Web3.utils.toBN(0),
                    amountOut: Web3.utils.toBN(0),
                  },
                ];

            const realSlippage = slippage1.value <= 1 ? slippage1 : slippage2;

            const slippage = fnName === "unknown" ? 0 : realSlippage.value;

            // const isSlippageBot = slippage > 0.7501;
            const isSlippageBot = slippage >= 0.95;

            const isDeadlineBot =
              deadline > Web3.utils.toBN(timestamp).addn(12000);

            const isGweiZero = Web3.utils.toBN(gasPrice).eqn(0);

            const isBot =
              isSlippageBot || isDeadlineBot || isGweiZero || isProxy;

            return {
              _id: event._id,

              token: DEFT_TOKEN,
              chainId,

              isBuy,
              isProxy,

              txHash,
              from,
              to,
              blockNumber: event.blockNumber,

              fnName,
              amountInMax: amountInMax.toString(),
              amountOutMin: amountOutMin.toString(),

              amountIn: realSlippage.amountIn.toString(),
              amountOut: realSlippage.amountOut.toString(),

              deadline: deadline.toString(),

              slippage,
              slippage1: slippage1.value,
              slippage2: slippage2.value,

              // amount0In,
              // amount1In,

              // amount0Out,
              // amount1Out,

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
        result => result && !(result instanceof Error),
      ) as DeftTransaction[];

      const someError = results.find(item => item instanceof Error) as Error;

      if (someError) {
        console.log(someError);
        console.log(
          "error occured while fetching transactions, check whether something went wrong",
        );

        return -1;
      }

      if (validResults.length > 0) {
        await this.deftTransactionRepo.insertMany(validResults);
      }

      const blocksFromResults = items.map(item => item.blockNumber);
      const minBlockFromResults = Math.min(...blocksFromResults);
      const maxBlockFromResults = Math.max(...blocksFromResults);

      const blocksToTravel = _.dropRightWhile(
        _.dropWhile(blocks, b => b < minBlockFromResults),
        b => b > maxBlockFromResults,
      );
      const mergedHolders = blocksToTravel.flatMap(block =>
        Array.from(holdersByBlock[block]),
      );

      await this.deftTokenStateRepo.updateState(
        chainId,
        thisLatestBlock,
        mergedHolders,
      );

      i += items.length;
      j += results.length;
      // prettier-ignore
      console.log('min block: ' + minBlockFromResults, ' max block: ' + maxBlockFromResults)
      console.log("holders count: " + mergedHolders.length);
      console.log("inserted deft transactions: ", i, " ", j);
    }

    return j;
  }
}

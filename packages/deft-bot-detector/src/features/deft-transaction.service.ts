import _ from "lodash";
import Web3 from "web3";
import { Log } from "web3-core";
import { Swap, Transfer } from "../../types/web3-v1-contracts/UniswapPair";
import uniswapV2Router from "../contracts/UniswapV2Router.json";
import {
  deftTokenContract,
  deftUniswapPairContract,
  DEFT_TOKEN,
  DEFT_UNISWAP_PAIR,
  DEFT_UNISWAP_PAIR_START_BLOCK,
  globalWeb3Client,
  isContractBulkContract,
  uniswapPairContractAbi,
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

const collectionName = "deft-transactions";

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
  ) {
    const blockFilter = {
      blockNumber: {
        $gte: fromBlockNumber,
        $lte: toBlockNumber,
      },
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

export class DeftTransactionService {
  deftTransactionRepo = new DeftTransactionRepository();

  async getIsToken0Deft(deftAddr: string) {
    let isToken0Deft = await globalRedis.get(deftAddr);

    if (!isToken0Deft) {
      const token0 = await deftUniswapPairContract.methods.token0().call();
      isToken0Deft = token0 == deftAddr ? "y" : "n";
      await globalRedis.set(deftAddr, isToken0Deft);
    }

    return isToken0Deft;
  }

  async syncTransactions() {
    const lastTx = await this.deftTransactionRepo.getLastTransaction();

    const { _id: lastItemId, blockNumber: lastBlockNumber } = lastTx
      ? lastTx
      : {
          _id: "",
          blockNumber: 1,
        };

    const isToken0Deft = await this.getIsToken0Deft(DEFT_TOKEN);
    const defaultOrder = isToken0Deft == "y";

    const latestBlock = await globalWeb3Client.eth.getBlockNumber();

    // TODO: add environment variable
    const fromBlock = Math.max(
      DEFT_UNISWAP_PAIR_START_BLOCK,
      lastBlockNumber + 1,
    );

    const web3 = globalWeb3Client;
    const newEvents = await getPastLogs(
      web3,
      DEFT_UNISWAP_PAIR,
      fromBlock,
      latestBlock,
      [SWAP_EVENT_HASH],
    );

    const newEventsNoDups = newEvents;

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

            const { timestamp } = await globalWeb3Client.eth.getBlock(
              blockNumber,
            );

            const {
              input,
              value,
              hash: txHash,
            } = await globalWeb3Client.eth.getTransaction(transactionHash);

            const { from, to, logs } =
              await globalWeb3Client.eth.getTransactionReceipt(transactionHash);

            const decodedLogs = logs.map(item => decodeLog(web3, item, getAbi));

            const transfers = decodedLogs.filter(
              item => item.eventName === "Transfer",
            ) as EventDoc<Transfer, any>[];

            const swaps = decodedLogs.filter(
              item => item.eventName === "Swap",
            ) as EventDoc<Swap, any>[];

            const firstSwap = swaps
              ? swaps[0]
              : { decoded: { amount0In: "0", amount1In: "0" } };

            const latestSwap = swaps
              ? swaps[swaps.length - 1]
              : { decoded: { amount0Out: "0", amount1Out: "0" } };

            const amount0In = firstSwap.decoded.amount0In;
            const amount1In = firstSwap.decoded.amount1In;

            const amount0Out = latestSwap.decoded.amount0Out;
            const amount1Out = latestSwap.decoded.amount1Out;

            let isBuy = false;
            if (defaultOrder) {
              isBuy = Web3.utils.toBN(amount1In).gt(Web3.utils.toBN(1));
            } else {
              isBuy = Web3.utils.toBN(amount0In).gt(Web3.utils.toBN(1));
            }

            const recipients = transfers.map(item => item.decoded.to);
            const recipientsBalancesBefore = await Promise.all(
              recipients.map(item =>
                deftTokenContract.methods
                  .balanceOf(item)
                  .call({}, blockNumber - 1),
              ),
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

            const amountIn = Web3.utils
              .toBN(amount0In)
              .add(Web3.utils.toBN(amount1In));

            const amountOut = Web3.utils
              .toBN(amount0Out)
              .add(Web3.utils.toBN(amount1Out));

            const num1 = Number(Web3.utils.fromWei(amountInMax));
            const deNom1 = Number(Web3.utils.fromWei(amountIn));

            const slippagePercentIn = Math.abs((num1 - deNom1) / deNom1);

            const num2 = Number(web3.utils.fromWei(amountOut));
            const deNom2 = Number(web3.utils.fromWei(amountOutMin));

            const slippagePercentOut = Math.abs((num2 - deNom2) / num2);

            const slippage = slippagePercentIn + slippagePercentOut - 1;

            const isSlippageBot = slippage > 0.5001;
            const isDeadlineBot =
              deadline > Web3.utils.toBN(timestamp).addn(10800);

            const isBot = isSlippageBot || isDeadlineBot;

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

              deadline: deadline.toString(),
              slippage,

              recipients: realRecipients,

              isBot,
              isSlippageBot,
              isDeadlineBot,
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

      await this.deftTransactionRepo.insertMany(validResults);

      i += items.length;
      j += results.length;
      console.log("inserted deft transactions: ", i, " ", j);
    }

    return j;
  }
}

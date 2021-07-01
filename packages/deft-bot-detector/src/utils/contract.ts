import { HttpProxyAgent } from "hpagent";
import Web3 from "web3";
import { DeftToken } from "../../types/web3-v1-contracts/DeftToken";
import { IsContractBulk } from "../../types/web3-v1-contracts/IsContractBulk";
import { UniswapPair } from "../../types/web3-v1-contracts/UniswapPair";
import deftTokenContractAbi from "../contracts/DeftToken.json";
import isContractBulkContractAbi from "../contracts/IsContractBulk.json";
import uniswapPairContractAbi from "../contracts/UniswapPair.json";
import { globalConfig } from "./config";

export const createAgent = (proxy: string) => {
  return new HttpProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy,
    // rejectUnauthorized: false,
  });
};

const env = globalConfig.isDevelopment ? "development" : "production";
const contract = globalConfig[env].contract;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    // "http://secret:X4gDeGtfQy2M@eth-node.valar-solutions.com/",
    contract.commonProvider,
    {
      ...(globalConfig.isDevelopment
        ? {
            agent: {
              http: createAgent("http://localhost:8883"),
            },
          }
        : {}),
    },
  ),
);

const web3_2 = new Web3(
  new Web3.providers.HttpProvider(
    // "https://eth-mainnet.alchemyapi.io/v2/mBo3SzayqDld2gXipvIWqHOLesqHsKNK",
    contract.balanceProvider,
  ),
);

export const globalWeb3Client = web3;

export const SYNC_TIMEOUT = 2000;

export const DEFT_UNISWAP_PAIR_START_BLOCK = Number(
  contract.deftUniswapPairStartBlock,
);

export const DEFT_UNISWAP_PAIR = contract.deftUniswapPair;

export const uniswapPairContract = (address: string) =>
  new web3.eth.Contract(
    // @ts-ignore
    uniswapPairContractAbi,
    address,
  ) as unknown as UniswapPair;

export const DEFT_TOKEN = contract.deftToken;
export const WETH_TOKEN = contract.wethToken;

export const deftTokenContract = new web3_2.eth.Contract(
  // @ts-ignore
  deftTokenContractAbi,
  DEFT_TOKEN,
) as unknown as DeftToken;

export const IS_CONTRACT_BULK = contract.isContractBulk;

export const isContractBulkContract = new web3.eth.Contract(
  // @ts-ignore
  isContractBulkContractAbi,
  IS_CONTRACT_BULK,
) as unknown as IsContractBulk;

export {
  uniswapPairContractAbi,
  deftTokenContractAbi,
  isContractBulkContractAbi,
};

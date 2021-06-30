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

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "http://secret:X4gDeGtfQy2M@eth-node.valar-solutions.com/",

    {
      ...(globalConfig.isDevelopment
        ? {
            agent: {
              // https: createAgent("http://localhost:8883"),
              http: createAgent("http://localhost:8883"),
            },
          }
        : {}),
    },
  ),
);

const web3_2 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-mainnet.alchemyapi.io/v2/mBo3SzayqDld2gXipvIWqHOLesqHsKNK",

    {
      ...(globalConfig.isDevelopment
        ? {
            agent: {
              // https: createAgent("http://localhost:8883"),
              http: createAgent("http://localhost:8883"),
            },
          }
        : {}),
    },
  ),
);

export const globalWeb3Client = web3;

export const SYNC_TIMEOUT = 5000;

export const DEFT_UNISWAP_PAIR_START_BLOCK = 12495074;

export const DEFT_UNISWAP_PAIR = "0xfa6687922bf40ff51bcd45f9fd339215a4869d82";

export const deftUniswapPairContract = new web3.eth.Contract(
  // @ts-ignore
  uniswapPairContractAbi,
  DEFT_UNISWAP_PAIR,
) as unknown as UniswapPair;

export const DEFT_TOKEN = "0xdef1fac7bf08f173d286bbbdcbeeade695129840";

export const deftTokenContract = new web3_2.eth.Contract(
  // @ts-ignore
  deftTokenContractAbi,
  DEFT_TOKEN,
) as unknown as DeftToken;

export const IS_CONTRACT_BULK = "0x13882970C480EaFe5493Ef3DE2c6EF3DFA68E1F7";

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

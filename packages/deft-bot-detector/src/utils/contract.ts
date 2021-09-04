import { HttpsProxyAgent } from "hpagent";
import Web3 from "web3";
import { DeftStorageContract } from "../../types/web3-v1-contracts/DeftStorageContract";
import { DeftToken } from "../../types/web3-v1-contracts/DeftToken";
import { IsContractBulk } from "../../types/web3-v1-contracts/IsContractBulk";
import { UniswapPair } from "../../types/web3-v1-contracts/UniswapPair";
import deftStorageContractAbi from "../contracts/DeftStorageContract.json";
import deftTokenContractAbi from "../contracts/DeftToken.json";
import isContractBulkContractAbi from "../contracts/IsContractBulk.json";
import uniswapPairContractAbi from "../contracts/UniswapPair.json";
import { globalConfig } from "./config";

export const createAgent = (proxy: string) => {
  return new HttpsProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy,
    rejectUnauthorized: false,
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

const { PRIVATE_KEY } = process.env;

const applyMnemonicToWeb3 = (web3: Web3) => {
  if (!PRIVATE_KEY) {
    throw new Error("private key not found");
  }

  const _account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(_account);
  web3.eth.defaultAccount = _account.address;
  const account = _account.address;
};

// const web3_2 = new Web3(
//   new Web3.providers.HttpProvider(
//     // "https://eth-mainnet.alchemyapi.io/v2/mBo3SzayqDld2gXipvIWqHOLesqHsKNK",
//     contract.additionalProvider,
//   ),
// );

applyMnemonicToWeb3(web3);
export const globalWeb3Client = web3;

export const SYNC_TIMEOUT = 2000;

export const DEFT_TOKEN_START_BLOCK = Number(contract.deftTokenStartBlock);

// export const DEFT_UNISWAP_PAIR_START_BLOCK = Number(
//   contract.deftUniswapPairStartBlock,
// );

export const DEFT_UNISWAP_PAIR = contract.deftUniswapPair;

export const uniswapPairContract = (address: string) =>
  new web3.eth.Contract(
    // @ts-ignore
    uniswapPairContractAbi,
    address,
  ) as unknown as UniswapPair;

export const DEFT_TOKEN = contract.deftToken;
export const WETH_TOKEN = contract.wethToken;

export const deftTokenContract = (provider: Web3) =>
  new provider.eth.Contract(
    // @ts-ignore
    deftTokenContractAbi,
    DEFT_TOKEN,
  ) as unknown as DeftToken;

export const DEFT_STORAGE = contract.deftStorage;

export const deftStorageContract = new web3.eth.Contract(
  // @ts-ignore
  deftStorageContractAbi,
  DEFT_STORAGE,
) as unknown as DeftStorageContract;

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

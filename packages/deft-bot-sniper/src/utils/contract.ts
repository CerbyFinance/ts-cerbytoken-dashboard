require("dotenv").config();

import { HttpProxyAgent } from "hpagent";
import Web3 from "web3";
import { DeftStorageContract } from "../../types/web3-v1-contracts/DeftStorageContract";
import deftStorageContractAbi from "../contracts/DeftStorageContract.json";
import { globalConfig } from "./config";

export const createAgent = (proxy: string) => {
  return new HttpProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy,
  });
};

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

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    // "http://secret:X4gDeGtfQy2M@eth-node.valar-solutions.com/",
    // "http://secret:X4gDeGtfQy2M@eth-node-kovan.valar-solutions.com",
    "https://eth-kovan.alchemyapi.io/v2/NEugfQKr0tXJEa0POP1VGxoG0SIFxaao",

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

applyMnemonicToWeb3(web3);

export const globalWeb3Client = web3;

export const DEFT_STORAGE = "0x2466B1b6fC97DF9a347356DfE75306FA04a92093";

export const deftStorageContract = new web3.eth.Contract(
  // @ts-ignore
  deftStorageContractAbi,
  DEFT_STORAGE,
) as unknown as DeftStorageContract;

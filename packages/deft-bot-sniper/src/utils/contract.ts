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
    "https://eth-kovan.alchemyapi.io/v2/T-HrWz2nVQ8FIQ5227T0bfUTeO7UjZC5",

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

web3.eth.transactionPollingTimeout = 1800;
applyMnemonicToWeb3(web3);

export const globalWeb3Client = web3;

export const DEFT_STORAGE = "0x6B739F6737B3992bf906D2042999A5B0e9a7b178";

export const deftStorageContract = new web3.eth.Contract(
  // @ts-ignore
  deftStorageContractAbi,
  DEFT_STORAGE,
) as unknown as DeftStorageContract;

require("dotenv").config();

import { GraphQLClient } from "graphql-request";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core/types";
import { CrossChainBridge } from "../../types/web3-v1-contracts/CrossChainBridge";
import crossChainBridgeAbi from "../contracts/CrossChainBridge.json";
import { getSdk, ProofType } from "../graphql/types";
import { globalRedis } from "../utils/redis";
import { request } from "./request";

const MIN_PROOFS_TO_APPROVE = 1;
const ESTIMATE_MULT = 1.2;

const makeRemoteUrl = (chain: string) =>
  `http://server.wisetoken.me:8000/subgraphs/name/deft/deft-bridge-${chain}`;

// const makeRemoteUrl = (chain: string) =>
//   `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`;

const { PRIVATE_KEY } = process.env;

// const chains = ["kovan", "binance-test"];
const chains = ["binance", "ethereum"];

const nodeUrlByChain = {
  ethereum: "https://secret:X4gDeGtfQy2M@eth-node.valar-solutions.com", // 1
  binance: "https://secret:X4gDeGtfQy2M@bsc-node.valar-solutions.com", // 56
  ropsten: "https://ropsten.infura.io/v3/6af3a6f4302246e8bbd4e69b5bfc9e33", // 3
  kovan: "https://secret:X4gDeGtfQy2M@eth-node-kovan.valar-solutions.com", // 42
  ["binance-test"]:
    "https://secret:X4gDeGtfQy2M@bsc-node-testnet.valar-solutions.com", // 97
};

const contractByChain = {
  ethereum: "0xc89302c356A100A01bd235295b62eeA4D19CB6A5",
  binance: "0xc89302c356A100A01bd235295b62eeA4D19CB6A5",
  ropsten: "0x9fd0a5B42C7E536d9AFaF42707C80f195612601c",
  kovan: "0x9fd0a5B42C7E536d9AFaF42707C80f195612601c",
  ["binance-test"]: "0x9fd0a5B42C7E536d9AFaF42707C80f195612601c",
};

const chainToId = {
  ethereum: 1,
  binance: 56,
  ropsten: 3,
  kovan: 42,
  ["binance-test"]: 97,
};

const allowedPaths = [
  ["binance", "ethereum"],
  ["ethereum", "binance"],
  // ["kovan", "binance-test"],
  // ["binance-test", "kovan"],
] as [string, string][];

const applyMnemonicToWeb3 = (web3: Web3) => {
  if (!PRIVATE_KEY) {
    throw new Error("private key not found");
  }

  const _account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(_account);
  web3.eth.defaultAccount = _account.address;
  const account = _account.address;
};

const sdkAndWeb3ByChain = Object.fromEntries(
  chains.map(chain => {
    const client = new GraphQLClient(makeRemoteUrl(chain));
    const sdk = getSdk(client);

    const nodeUrl = nodeUrlByChain[chain];

    const web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
    web3.eth.transactionPollingTimeout = 86400;

    applyMnemonicToWeb3(web3);

    const contractAddress = contractByChain[chain];

    const contract = new web3.eth.Contract(
      // @ts-ignore
      crossChainBridgeAbi,
      contractAddress,
    ) as unknown as CrossChainBridge;

    return [
      chain,
      {
        web3,
        contract,
        sdk,
      },
    ];
  }),
);

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

  return result.body.data.standard;
};

const approveOne = async (
  contract: CrossChainBridge,
  web3: Web3,
  from: string,
  proofHash: string,
) => {
  const preparedMethod = contract.methods.markTransactionAsApproved(proofHash);

  const estimatedGas = await preparedMethod.estimateGas({
    from,
  });

  const gasPrice = await getGasPrice();

  if (gasPrice instanceof Error) {
    return gasPrice;
  }

  if (Number(gasPrice) > 50000000000) {
    return new Error("too high gwei");
  }

  const callGas = Math.floor(estimatedGas * ESTIMATE_MULT);

  const result = preparedMethod.send({
    from,
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

const approveMany = async (
  contract: CrossChainBridge,
  web3: Web3,
  from: string,
  proofHashes: string[],
) => {
  const preparedMethod =
    contract.methods.bulkMarkTransactionsAsApproved(proofHashes);

  const estimatedGas = await preparedMethod.estimateGas({
    from,
  });

  const gasPrice = await web3.eth.getGasPrice();
  const callGas = Math.floor(estimatedGas * ESTIMATE_MULT);

  const result = preparedMethod.send({
    from,
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

export const getPendingTransactions = async () => {
  const pending = await globalRedis.smembers("pending");

  const detailed = pending.map(item => {
    const [
      srcChain,
      destChain,
      minProofsBlock,
      maxProofsBlock,
      transactionHash,
    ] = item.split("-");

    return {
      srcChain,
      destChain,
      minProofsBlock,
      maxProofsBlock,
      transactionHash,
    };
  });

  return detailed;
};

type SDK = ReturnType<typeof getSdk>;

const blockNumberOfLatestApprovedProof = async (sdk: SDK) => {
  const { global } = await sdk.GlobalRecentProof({});

  const recentProof = global?.recentApprovedProof || "";

  const { proof } = await sdk.ProofBlockNumber({
    id: recentProof,
  });

  return proof?.blockNumber ? Number(proof.blockNumber) : 0;
};

const approver = async ([srcChain, destChain]: [string, string]) => {
  const source = sdkAndWeb3ByChain[srcChain];
  const dest = sdkAndWeb3ByChain[destChain];

  const from = source.web3.eth.accounts.wallet[0].address;
  const destChainId = chainToId[destChain] as number;

  const path = srcChain.replace("-", "_") + "-" + destChain.replace("-", "_");

  const log = (input: string) => {
    console.log(`(${path}) `, new Date().toLocaleString(), " ", input);
  };

  let once = false;
  while (true) {
    await new Promise(r => setTimeout(r, once ? 3000 : 0));
    once = true;

    try {
      const latestBlockNumber = await globalRedis
        .get(path + "-" + "latest_block_number")
        .then(some => (some ? Number(some) : 0));

      if (latestBlockNumber === 0) {
        log("!!! block must be gt than zero !!!");
        continue;
      }

      const { proofs } = await source.sdk.Proofs({
        // @ts-ignore
        blockNumber: latestBlockNumber + 1, // not including latest
        first: MIN_PROOFS_TO_APPROVE,
        proofType: ProofType.Burn,
        // @ts-ignore
        dest: destChainId,
      });

      log("latest block number: " + latestBlockNumber);

      if (proofs.length < MIN_PROOFS_TO_APPROVE) {
        // prettier-ignore
        log("min proofs: " + MIN_PROOFS_TO_APPROVE + ", current: " + proofs.length);
        continue;
      }

      const proofsBlocks = proofs.map(item => Number(item.blockNumber));

      const minProofsBlock = Math.min(...proofsBlocks);
      const maxProofsBlock = Math.max(...proofsBlocks);

      const proofsHashes = proofs.map(item => item.id);
      const approveRes = await approveOne(
        dest.contract,
        dest.web3,
        from,
        proofsHashes[0],
      );

      if (approveRes instanceof Error) {
        log(approveRes.message);
        continue;
      }

      const { pendingTx, transactionHash } = approveRes;

      // const { pendingTx, transactionHash } = await approveMany(
      //   dest.contract,
      //   dest.web3,
      //   from,
      //   proofsHashes,
      // );

      const detailedTransation = [
        path,
        minProofsBlock,
        maxProofsBlock,
        transactionHash,
      ].join("-");

      log("processing tx: " + transactionHash);
      await globalRedis.sadd("pending", detailedTransation);
      let txResult: TransactionReceipt;
      try {
        txResult = await pendingTx;
      } finally {
        await globalRedis.srem("pending", detailedTransation);
      }

      console.log(txResult);

      if (!txResult.status) {
        log("it's not approved for some reason");
        continue;
      }

      log("approved successfully");

      await globalRedis.set(path + "-" + "latest_block_number", maxProofsBlock);
    } catch (error) {
      log("things happen");
      console.log(error);
    }
  }
};

const fireAll = async () => {
  const chainsApprovers = allowedPaths.map(path => {
    return approver(path);
  });

  await Promise.all(chainsApprovers);
};

export const triggerRunJobs = () => {
  fireAll();
};

import Web3 from "web3";
import { CrossChainBridge } from "../../types/web3-v1-contracts/CrossChainBridge";
import crossChainBridgeAbi from "../contracts/CrossChainBridge.json";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://secret:X4gDeGtfQy2M@eth-node.wisetoken.me/",
    {},
  ),
);

export const globalWeb3Client = web3;

export const CROSS_CHAIN_BRIDGE_CONTRACT = "0x000000";

export const crossChainBridgeContract = new web3.eth.Contract(
  // @ts-ignore
  crossChainBridgeAbi,
  CROSS_CHAIN_BRIDGE_CONTRACT,
) as unknown as CrossChainBridge;

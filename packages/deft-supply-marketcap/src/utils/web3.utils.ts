import Web3 from "web3";
import { Log } from "web3-core";
import { AbiItem } from "web3-utils";
import { ContractEventLog } from "../../types/web3-v1-contracts/types";

export type EventDoc<T extends ContractEventLog<any>, Z extends string = ""> = {
  eventName: Z;
  decoded: T["returnValues"];
} & Log & { _id: string };

export const generateLogId = (log: Log) => {
  const shaId = Web3.utils
    .sha3(
      log.blockHash.replace("0x", "") +
        log.transactionHash.replace("0x", "") +
        log.logIndex.toString(16).replace("0x", ""), // todo check whether string
    )!
    .replace("0x", "")
    .substr(0, 16);
  return shaId;
};

export async function getPastLogs(
  web3: Web3,
  address: string,
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  if (fromBlock <= toBlock) {
    try {
      const options = {
        address: address,
        fromBlock: fromBlock,
        toBlock: toBlock,
      };

      console.log(`syncing, ${fromBlock} -> ${toBlock}`);
      return await web3.eth.getPastLogs(options);
    } catch (error) {
      const midBlock = (fromBlock + toBlock) >> 1;

      console.log(`syncing(mid), ${fromBlock} -> ${midBlock}`);
      const arr1 = await getPastLogs(web3, address, fromBlock, midBlock);

      console.log(`syncing(mid), ${midBlock + 1} -> ${toBlock}`);
      const arr2 = await getPastLogs(web3, address, midBlock + 1, toBlock);
      return [...arr1, ...arr2];
    }
  }
  return [];
}

const computeFnHash = (name: string, items: { type: string }[]) => {
  return Web3.utils.sha3(`${name}(${items.map(item => item.type).join(",")})`);
};

const getAbi = (events: any[], hash: string) => {
  return events.find(item => {
    const eventHash = computeFnHash(item.name, item.inputs);

    return eventHash === hash;
  });
};

export const createGetAbi = (abiContract: AbiItem[]) => {
  const events = abiContract.filter(item => item.type === "event");
  const eventsHashMap = Object.fromEntries(
    events.map(item => {
      const eventHash = computeFnHash(item.name!, item.inputs!);
      return [eventHash, item];
    }),
  );

  return (hash: string) => {
    return eventsHashMap[hash];
  };
};

export const decodeLog = (
  web3: Web3,
  item: Log,
  getAbi: (hash: string) => AbiItem | undefined,
) => {
  const abi = getAbi(item.topics[0])!;
  return {
    ...item,
    _id: generateLogId(item),
    eventName: abi.name,
    decoded: web3.eth.abi.decodeLog(
      abi.inputs!,
      item.data,
      item.topics.slice(1),
    ),
  } as EventDoc<any, any>;
};

const decodeLogs = (web3: Web3, logs: any[], getAbi: (hash: string) => any) => {
  const result = logs.map(item => {
    const abi = getAbi(item.topics[0])!;

    if (!abi) {
      console.log("abi not found");
      return {};
    }

    return {
      ...item,
      eventName: abi.name,
      decoded: web3.eth.abi.decodeLog(
        abi.inputs,
        item.data,
        item.topics.slice(1),
      ),
    };
  });

  return result;
};

import { Response } from "got";
import Web3 from "web3";
import { request } from "../features/request";
import {
  defiFactoryTokenContract,
  NamedChains,
  namedChains,
  STAKING_CONTRACT,
  TEAM_VESTING_CONTRACT,
  web3Map,
} from "./contract";
import { globalRedis } from "./redis";

// const lockedSupply = await contract.methods
// .balanceOf(TEAM_VESTING_CONTRACT)
// .call()
// .then(some => Web3.utils.toBN(some));

const getOrUpdateSupplies = async () => {
  const totalSupplies = await Promise.all(
    namedChains.map(async item => {
      const web3 = web3Map[item];

      const contract = defiFactoryTokenContract(web3);

      const totalSupply = await contract.methods
        .totalSupply()
        .call()
        .then(some => Number(Web3.utils.fromWei(some)));

      return totalSupply;
    }),
  );

  const totalDilutedSupply = totalSupplies.reduce((acc, val) => acc + val, 0);

  const stakedSupplies = await Promise.all(
    (["polygon", "bsc"] as NamedChains[]).map(async item => {
      const web3 = web3Map[item];
      const contract = defiFactoryTokenContract(web3);
      const stakedSupply = await contract.methods
        .balanceOf(STAKING_CONTRACT)
        .call()
        .then(some => Number(Web3.utils.fromWei(some)));

      return stakedSupply;
    }),
  );

  const stakedSupply = stakedSupplies.reduce((acc, val) => acc + val, 0);

  const vestedSupply = await defiFactoryTokenContract(web3Map["eth"])
    .methods.balanceOf(TEAM_VESTING_CONTRACT)
    .call()
    .then(some => Number(Web3.utils.fromWei(Web3.utils.toBN(some))));

  const circulatingSupply = totalDilutedSupply - stakedSupply - vestedSupply;

  const result = await globalRedis.set(
    "supplies",
    JSON.stringify({
      totalDilutedSupply,
      stakedSupply,
      vestedSupply,
      circulatingSupply,
    }),
  );

  return result === "OK";
};

type PriceRes = {
  data: {
    tokens: {
      id: string;
      price: string;
    }[];
  };
};

const makePriceReq = (graphName: string) => {
  return request<PriceRes>(
    {
      method: "POST",
      url:
        "http://nodes2.valar-solutions.com:8000/subgraphs/name/deft/" +
        graphName,
      headers: {
        "Content-Type": "application/json",
      },
      json: {
        query: `{
          tokens {
            id
            price
          }
        }
        `,
        variables: null,
      },
    },
    undefined,
  );
};

const getOrUpdatePrices = async () => {
  const results = await Promise.all(
    ["deft-uniswap-v3", "deft-pancakeswap-v2", "deft-quickswap-v2"].map(item =>
      makePriceReq(item),
    ),
  );

  const ifThereIsError = results.find(item => item instanceof Error);

  if (ifThereIsError instanceof Error) {
    return ifThereIsError;
  }

  const prices = (results as Response<PriceRes>[]).map(item => {
    const tokens = item.body.data.tokens;
    const priceDeftInUsd = tokens.find(item => item.id === "deftInUsd");
    return Number(priceDeftInUsd!.price);
  });

  const result2 = await globalRedis.set("prices", JSON.stringify(prices));

  return result2 === "OK";
};

const getOrUpdatePairBalances = async () => {
  const addresses = [
    "0x81489b0e7c7a515799c89374e23ac9295088551d",
    "0x493e990ccc67f59a3000effa9d5b1417d54b6f99",
    "0xf92b726b10956ff95ebabdd6fd92d180d1e920da",
  ];
  const pairBalances = await Promise.all(
    namedChains.map(async (item, i) => {
      const web3 = web3Map[item];

      const address = addresses[i];

      const contract = defiFactoryTokenContract(web3);
      const balanceOfPair = await contract.methods
        .balanceOf(address)
        .call()
        .then(some => Number(Web3.utils.fromWei(some)));

      return balanceOfPair;
    }),
  );

  const result2 = await globalRedis.set(
    "pairBalances",
    JSON.stringify(pairBalances),
  );

  return result2 === "OK";
};

const fire0 = async () => {
  while (true) {
    try {
      console.log(new Date().toLocaleString(), " ", "updating supplies");
      const result = await getOrUpdateSupplies();
      console.log(new Date().toLocaleString(), " ", "supplies updated");
    } catch (error) {
      console.log("supplies syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 10 * 1000));
  }
};

const fire1 = async () => {
  while (true) {
    try {
      console.log(new Date().toLocaleString(), " ", "updating prices");
      await getOrUpdatePrices();
      console.log(new Date().toLocaleString(), " ", "prices update");
    } catch (error) {
      console.log("wise days syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 1 * 1000));
  }
};

const fire2 = async () => {
  while (true) {
    try {
      console.log(new Date().toLocaleString(), " ", "updating prices");
      await getOrUpdatePairBalances();
      console.log(new Date().toLocaleString(), " ", "prices update");
    } catch (error) {
      console.log("wise days syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 1 * 1000));
  }
};

const fireAll = async () => {
  await Promise.all([fire0(), fire1(), fire2()]);
};

export const triggerRunJobs = () => {
  fireAll();
};

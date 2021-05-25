import Web3 from "web3";
import { request } from "../features/request";
import {
  globalDefiFactoryTokenContract,
  TEAM_VESTING_CONTRACT,
} from "./contract";
import { globalRedis } from "./redis";

const getOrUpdateSupplies = async () => {
  const totalSupply = await globalDefiFactoryTokenContract.methods
    .totalSupply()
    .call()
    .then(some => Web3.utils.toBN(some));
  const lockedSupply = await globalDefiFactoryTokenContract.methods
    .balanceOf(TEAM_VESTING_CONTRACT)
    .call()
    .then(some => Web3.utils.toBN(some));

  const circulatingSupply = totalSupply.sub(lockedSupply);

  const result = await globalRedis.set(
    "supplies",
    JSON.stringify({
      totalSupply: Number(Web3.utils.fromWei(totalSupply)),
      lockedSupply: Number(Web3.utils.fromWei(lockedSupply)),
      circulatingSupply: Number(Web3.utils.fromWei(circulatingSupply)),
    }),
  );

  return result === "OK";
};

const getOrUpdatePrices = async () => {
  const result = await request<{
    data: {
      tokens: {
        id: string;
        price: string;
      }[];
    };
  }>(
    {
      method: "POST",
      url: `http://server.wisetoken.me:8000/subgraphs/name/deft/deft-uniswap-v2`,
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

  if (result instanceof Error) {
    return result;
  }

  const tokens = result.body.data.tokens;

  const priceDeftInEth = tokens.find(item => item.id === "deftInEth");
  const priceDeftInUsd = tokens.find(item => item.id === "deftInUsd");

  // console.log(parseFloat(priceDeftInUsd!.price));
  // console.log(priceDeftInUsd!.price);

  const result2 = await globalRedis.set(
    "prices",
    JSON.stringify({
      priceDeftInEth: Number(priceDeftInEth!.price),
      priceDeftInUsd: Number(priceDeftInUsd!.price),
    }),
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

const fireAll = async () => {
  await Promise.all([fire0(), fire1()]);
};

export const triggerRunJobs = () => {
  fireAll();
};

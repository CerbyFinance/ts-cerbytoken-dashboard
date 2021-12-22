import { Response } from "got";
import Web3 from "web3";
import { request } from "../features/request";
import {
  BUFFER_FUND_CONTRACT,
  defiFactoryTokenContract,
  NamedChains,
  namedChains,
  STABLE_COIN_FUND_CONTRACT,
  STAKING_CONTRACT,
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
    (["polygon", "bsc", "avalanche", "fantom", "eth"] as NamedChains[]).map(
      async item => {
        const web3 = web3Map[item];
        const contract = defiFactoryTokenContract(web3);
        const stakedSupply = await contract.methods
          .balanceOf(STAKING_CONTRACT)
          .call()
          .then(some => Number(Web3.utils.fromWei(some)));

        return stakedSupply;
      },
    ),
  );

  const stakedSupply = stakedSupplies.reduce((acc, val) => acc + val, 0);

  // const vestedSupply = await defiFactoryTokenContract(web3Map["eth"])
  //   .methods.balanceOf(TEAM_VESTING_CONTRACT)
  //   .call()
  //   .then(some => Number(Web3.utils.fromWei(Web3.utils.toBN(some))));

  // const circulatingSupply = totalDilutedSupply - stakedSupply ;

  const result = await globalRedis.set(
    "supplies",
    JSON.stringify({
      totalDilutedSupply,
      stakedSupply,
      // vestedSupply,
      // circulatingSupply,
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
      url: "http://nodes2.valar-solutions.com:8000/subgraphs/name/" + graphName,
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
    [
      "deft/deft-uniswap-v3",
      "deft/deft-pancakeswap-v2",
      "deft/deft-quickswap-v2",
      "cerby/cerby-traderjoe-v2",
      "cerby/cerby-spookyswap-v2",
    ].map(item => makePriceReq(item)),
  );

  const ifThereIsError = results.find(item => item instanceof Error);

  if (ifThereIsError instanceof Error) {
    return ifThereIsError;
  }

  const prices = (results as Response<PriceRes>[]).map(item => {
    const tokens = item.body.data.tokens;
    const priceDeftInUsd = tokens.find(
      item => item.id === "deftInUsd" || item.id === "cerbyInUsd",
    );

    return priceDeftInUsd ? Number(priceDeftInUsd!.price) : 0;
  });

  const result2 = await globalRedis.set("prices", JSON.stringify(prices));

  return result2 === "OK";
};

const getOrUpdateFundBalances = async () => {
  const addresses = await Promise.all(
    [BUFFER_FUND_CONTRACT, STABLE_COIN_FUND_CONTRACT].map(item =>
      Promise.all(
        namedChains
          .map(async (item2, i) => {
            const web3 = web3Map[item2];

            const contract = defiFactoryTokenContract(web3);
            const amount = await contract.methods
              .balanceOf(item)
              .call()
              .then(some => Number(Web3.utils.fromWei(some)));

            return amount;
          })
          .map(item => item.catch(e => 0)),
      ),
    ),
  );

  const [bufferFund, stableCoinFund] = addresses.map(item =>
    item.reduce((acc, val) => acc + val, 0),
  );

  const result2 = await globalRedis.set(
    "fundBalances",
    JSON.stringify({
      bufferFund,
      stableCoinFund,
    }),
  );

  return result2 === "OK";
};

const getOrUpdatePairBalances = async () => {
  const addresses = [
    "0x81489b0e7c7a515799c89374e23ac9295088551d", // eth
    "0x493e990ccc67f59a3000effa9d5b1417d54b6f99", // bsc
    "0xf92b726b10956ff95ebabdd6fd92d180d1e920da", // poly
    "0x4e2d00526ae280d5aa296c321a8d32cd2486a737", // avax
    "0xD450c27c7024f5813449CA30f0D7c4F9d0a19c77", // ftm
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

const arbitrage = async () => {
  const pricesStr = await globalRedis.get("prices");
  const pairBalances = await globalRedis.get("pairBalances");

  const prices = JSON.parse(pricesStr!) as number[];

  const balances = JSON.parse(pairBalances!) as number[];

  const usdBalances = balances.map((item, i) => item * prices[i]);

  const chains = [0, 1, 2, 3, 4];
  const namedChains = ["eth", "bsc", "poly", "avax", "ftm"];

  const fee = 0.997;

  const combos = chains
    .flatMap(item => chains.map(item2 => [item, item2] as [number, number]))
    .filter(item => item[0] !== item[1] && prices[item[0]] < prices[item[1]])
    .map(item => {
      const [Ua, Ca] = [usdBalances[item[0]], balances[item[0]]];

      const [Ub, Cb] = [usdBalances[item[1]], balances[item[1]]];

      const K = Math.sqrt((Ua * Ca) / (Ub * Cb));

      const BuyAmountOnChainA =
        (Ua * (Ca - Cb * K)) / (fee * K * (Cb + Ca * fee));
      const SellAmountOnChainB = (Ub * fee * (Ca - Cb * K)) / (Cb + Ca * fee);

      const Profit = SellAmountOnChainB - BuyAmountOnChainA;

      return {
        from: namedChains[item[0]],
        to: namedChains[item[1]],
        buyAmount: BuyAmountOnChainA,
        sellAmount: SellAmountOnChainB,
        profit: Profit,
      };
    })
    .filter(item => item.profit > 0)
    .sort((a, b) => b.profit - a.profit);

  const result2 = await globalRedis.set(
    "arbitrageCombos",
    JSON.stringify(combos),
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
      console.log("syncing error:");
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
      console.log("syncing error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 1 * 1000));
  }
};

const fire3 = async () => {
  while (true) {
    try {
      await arbitrage();
    } catch (error) {
      console.log("error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 1 * 1000));
  }
};

const fire4 = async () => {
  while (true) {
    try {
      await getOrUpdateFundBalances();
    } catch (error) {
      console.log("error:");
      console.log(error);
    }
    await new Promise(r => setTimeout(r, 1 * 1000));
  }
};

const fireAll = async () => {
  await Promise.all([fire0(), fire1(), fire2(), fire3(), fire4()]);
};

export const triggerRunJobs = () => {
  fireAll();
};

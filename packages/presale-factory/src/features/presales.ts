import Web3 from "web3";
import { PresaleFactory } from "../../types/web3-v1-contracts/PresaleFactory";
import presaleFactoryAbi from "../contracts/PresaleFactory.json";
import { globalRedis } from "../utils/redis";
import { shortEnglishHumanizer } from "../utils/utils";

const globalChains = [
  {
    chainId: 42,
    factoryContractAddress: "0xc44b736826D2Eb7af13A0541b5D2eACE137D5511",
    node: "https://secret:X4gDeGtfQy2M@eth-node-kovan.valar-solutions.com",
  },
  /*{
    chainId: 3,
    factoryContractAddress: "0xa7894bc572ffbC27fb1c7F4E36185B276b1a5068",
    node: "https://secret:X4gDeGtfQy2M@eth-node-ropsten.valar-solutions.com",
  },
  {
    chainId: 97,
    factoryContractAddress: "0xb502633f80e66ae1c9e7d068812f85028a4e22fe",
    node: "https://secret:X4gDeGtfQy2M@bsc-node-testnet.valar-solutions.com",
  },*/
];

const allChainIds = globalChains.map(item => item.chainId);

const createPresaleFactoryContract = (address: string, web3: Web3) =>
  new web3.eth.Contract(
    // @ts-ignore
    presaleFactoryAbi,
    address,
  ) as unknown as PresaleFactory;

const chainIdToContract = Object.fromEntries(
  globalChains.map(chain => [
    chain.chainId,
    createPresaleFactoryContract(
      chain.factoryContractAddress,
      new Web3(new Web3.providers.HttpProvider(chain.node)),
    ),
  ]),
);

export const FERROR = ["chain_not_found", "page_or_limit_invalid"] as const;

export type FErrors = typeof FERROR[number];
export class FError extends Error {
  constructor(m: FErrors) {
    super(m);
    Object.setPrototypeOf(this, FError.prototype);
  }
}

const PASSED_SEC = 10 * 1000;
const LIST_PREFIX = "l";
const LIST_TS_PREFIX = "lts";
const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

const makeKey = (
  walletAddress: string,
  chainId: number,
  page: number,
  limit: number,
) => walletAddress + ":" + chainId + ":" + page + ":" + limit;

const fetchOrGet = async <T>(
  _key: string,
  fetch: () => Promise<T>,
): Promise<T> => {
  const listKey = LIST_PREFIX + ":" + _key;
  const listTsKey = LIST_TS_PREFIX + ":" + _key;

  const isPassed = await globalRedis.get(listTsKey).then(ts => {
    return Date.now() - (Number(ts) || 0) > PASSED_SEC;
  });

  if (!isPassed) {
    const result = await globalRedis.get(listKey);
    return JSON.parse(result!);
  }

  const fetched = await fetch();

  await globalRedis.set(listTsKey, Date.now());
  await globalRedis.set(listKey, JSON.stringify(fetched));

  return fetched;
};

const fromWeiNum = (s: string) => {
  return Number(Web3.utils.fromWei(s));
};

export const listPresales = async (
  _walletAddress: string,
  _chains: number[],
  isActive: boolean | undefined,
  page: number,
  limit: number,
) => {
  const validated = typeof page === "number" && typeof limit === "number";

  if (!validated) {
    return new FError("page_or_limit_invalid");
  }

  const walletAddress = _walletAddress || ZERO_ADDR;

  const chains =
    _chains.length === 0
      ? allChainIds
      : _chains.filter(chain =>
          globalChains.some(item => item.chainId === chain),
        );

  if (chains.length === 0) {
    return new FError("chain_not_found");
  }

  const result0 = await Promise.all(
    chains.map(async chainId => {
      const contract = chainIdToContract[chainId];

      const _key = makeKey(walletAddress, chainId, page, limit);

      const fetched = await fetchOrGet(_key, async () => {
        const result = await contract.methods
          .listPresales(walletAddress, page, limit)
          .call();

        const prepared = result.map(item => ({
          chainId,
          // prettier-ignore
          presaleList: {
            presaleContractAddress: item[0][0],
            presaleName: item[0][1],
            totalInvestedWeth: fromWeiNum(item[0][2]),
            maxWethCap: fromWeiNum(item[0][3]),
            isActive: item[0][4],
            isEnabled: item[0][5],
            website: item[0][6],
            telegram: item[0][7],
          },
          // prettier-ignore
          walletInfo: {
            walletAddress: item[1][0],
            walletInvestedWeth: fromWeiNum(item[1][1]),
            walletReferralEarnings: fromWeiNum(item[1][2]),
            minimumWethPerWallet: fromWeiNum(item[1][3]),
            maximumWethPerWallet: fromWeiNum(item[1][4]), 
          },
          // prettier-ignore
          vestingInfo: {
            vestingAddr: item[2][0],
            tokensReserved: fromWeiNum(item[2][1]),
            tokensClaimed: fromWeiNum(item[2][2]), 
            lockedUntilTimestamp: Number(item[2][3]),
            vestedUntilTimestamp: Number(item[2][4]),
          },
          tokenomics: item[3]
            .map(item2 => ({
              tokenomicsAddr: item2[0],
              tokenomicsName: item2[1],
              tokenomicsPercentage: Number(item2[2]) / 1e6,
              tokenomicsLockedForXSeconds: Number(item2[3]),
              tokenomicsVestedForXSeconds: Number(item2[4]),

              tokenomicsLockedFor: shortEnglishHumanizer(Number(item2[3]), {
                maxDecimalPoints: 0,
                round: true,
                largest: 1,
              }),
              tokenomicsVestedFor: shortEnglishHumanizer(Number(item2[4]), {
                maxDecimalPoints: 0,
                round: true,
                largest: 1,
              }),
            }))
            .filter(
              item2 =>
                item2.tokenomicsAddr !== ZERO_ADDR ||
                Number(item2.tokenomicsPercentage) !== 0,
            ),
          listingPrice: fromWeiNum(item[4]),
          createdAt: Number(item[5]),
        }));

        return prepared;
      });

      return fetched;
    }),
  );

  const result1 = result0.flatMap(item => item.map(item2 => item2));

  // sort is mutable
  result1.sort(
    (a, b) =>
      Number(b.presaleList.isActive) - Number(a.presaleList.isActive) ||
      b.createdAt - a.createdAt,
  );

  const result2 =
    typeof isActive === "boolean"
      ? result1.filter(item => item.presaleList.isActive === isActive)
      : result1;

  return result2;
};

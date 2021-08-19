import Web3 from "web3";
import { PresaleFactory } from "../../types/web3-v1-contracts/PresaleFactory";
import presaleFactoryAbi from "../contracts/PresaleFactory.json";
import { globalRedis } from "../utils/redis";
import { shortEnglishHumanizer } from "../utils/utils";

const globalChains = [
  // {
  //   chainCode: "kovan",
  //   chainName: "Kovan Testnet",
  //   chainId: 42,
  //   factoryContractAddress: "0x31e43cBEA2f7F20491212F4986780dbE6BC2a442",
  //   node: "https://secret:X4gDeGtfQy2M@eth-node-kovan.valar-solutions.com",
  // },
  {
    chainCode: "binance-test",
    chainName: "Binance Testnet",
    chainId: 97,
    factoryContractAddress: "0xbdA1F977381E3E60a481bCF3773dDd4d70a6DFE7",
    node: "https://secret:X4gDeGtfQy2M@bsc-node-testnet.valar-solutions.com",
  },
];

const allChainCodes = globalChains.map(item => item.chainCode);

const chainCodeToNameId = Object.fromEntries(
  globalChains.map(chain => [
    chain.chainCode,
    {
      chainCode: chain.chainCode,
      chainName: chain.chainName,
      chainId: chain.chainId,
    },
  ]),
);

const createPresaleFactoryContract = (address: string, web3: Web3) =>
  new web3.eth.Contract(
    // @ts-ignore
    presaleFactoryAbi,
    address,
  ) as unknown as PresaleFactory;

const chainCodeToContract = Object.fromEntries(
  globalChains.map(chain => [
    chain.chainCode,
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

const PASSED_SEC = 30 * 1000;
const LIST_PREFIX = "l";
const LIST_TS_PREFIX = "lts";
const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

const makeKey = (
  walletAddress: string,
  chain: string,
  page: number,
  limit: number,
) => walletAddress + ":" + chain + ":" + page + ":" + limit;

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

export const listPresales = async (
  _walletAddress: string,
  _chains: string[],
  isCompleted: boolean | undefined,
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
      ? allChainCodes
      : _chains.filter(chain =>
          globalChains.some(item => item.chainCode === chain),
        );

  if (chains.length === 0) {
    return new FError("chain_not_found");
  }

  const result = await Promise.all(
    chains.map(async chainCode => {
      const contract = chainCodeToContract[chainCode];

      const nameId = chainCodeToNameId[chainCode];

      const _key = makeKey(walletAddress, chainCode, page, limit);

      const fetched = await fetchOrGet(_key, async () => {
        const result = await contract.methods
          .listPresales(walletAddress, page, limit)
          .call();

        const prepared = result.map(item => ({
          // prettier-ignore
          presaleList: {
            presaleContractAddress: item[0][0],
            presaleName: item[0][1],
            totalInvestedWeth: (Number(Web3.utils.fromWei(item[0][2]))).toFixed(4),
            maxWethCap: (Number(Web3.utils.fromWei(item[0][3]))).toFixed(4),
            isCompleted: item[0][4],
            isEnabled: item[0][5],
            website: item[0][6],
            telegram: item[0][7],
          },
          // prettier-ignore
          walletInfo: {
            walletAddress: item[1][0],
            walletInvestedWeth: (Number(Web3.utils.fromWei(item[1][1]))).toFixed(4),
            walletReferralEarnings: (Number(Web3.utils.fromWei(item[1][2]))).toFixed(4),
            minimumWethPerWallet: (Number(Web3.utils.fromWei(item[1][3]))).toFixed(4),
            maximumWethPerWallet: (Number(Web3.utils.fromWei(item[1][4]))).toFixed(4), 
          },
          // prettier-ignore
          vestingInfo: {
            vestingAddr: item[2][0],
            tokensReserved: (Number(Web3.utils.fromWei(item[2][1]))).toFixed(4),
            tokensClaimed: (Number(Web3.utils.fromWei(item[2][2]))).toFixed(4), 
            lockedUntilTimestamp: item[2][3],
            vestedUntilTimestamp: item[2][4],
          },
          tokenomics: item[3]
            .map(item2 => ({
              tokenomicsAddr: item2[0],
              tokenomicsName: item2[1],
              tokenomicsPercentage: Number(item2[2]) / 1e6,
              tokenomicsLockedForXSeconds: item2[3],
              tokenomicsVestedForXSeconds: item2[4],

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
          listingPrice: Number(Web3.utils.fromWei(item[4])).toFixed(6),
          createdAt: Number(item[5]),
        }));

        return prepared;
      });

      // sort is mutable
      fetched.sort(
        (a, b) =>
          Number(a.presaleList.isCompleted) -
            Number(b.presaleList.isCompleted) || b.createdAt - a.createdAt,
      );

      const fetchedFilter =
        typeof isCompleted === "boolean"
          ? fetched.filter(item => item.presaleList.isCompleted === isCompleted)
          : fetched;

      return {
        ...nameId,
        result: fetchedFilter,
      };
    }),
  );

  return result;
};

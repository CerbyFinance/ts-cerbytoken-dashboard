import Web3 from "web3";
import { PresaleFactory } from "../../types/web3-v1-contracts/PresaleFactory";
import presaleFactoryAbi from "../contracts/PresaleFactory.json";
import { globalRedis } from "../utils/redis";
import { shortEnglishHumanizer } from "../utils/utils";

const globalChains = [
  {
    chainCode: "kovan",
    chainName: "Kovan Testnet",
    chainId: 42,
    factoryContractAddress: "0xd02bfe66fa0a9bc6b5769fc56fe68cd1e921e2d1",
    node: "https://secret:X4gDeGtfQy2M@eth-node-kovan.valar-solutions.com",
  },
  {
    chainCode: "ropsten",
    chainName: "ropsten Testnet",
    chainId: 3,
    factoryContractAddress: "0x5859dd36e4ac6cb63f7f69be09a904637be70173",
    node: "https://secret:X4gDeGtfQy2M@eth-node-ropsten.valar-solutions.com",
  },
  // {
  //   chainCode: "binance-test",
  //   chainName: "Binance Testnet",
  //   chainId: 97,
  //   factoryContractAddress: "0xbdA1F977381E3E60a481bCF3773dDd4d70a6DFE7",
  //   node: "https://secret:X4gDeGtfQy2M@bsc-node-testnet.valar-solutions.com",
  // },
];

const allChainIds = globalChains.map(item => item.chainId);

const chainIdToNameId = Object.fromEntries(
  globalChains.map(chain => [
    chain.chainId,
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

const PASSED_SEC = 30 * 1000;
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

      const nameId = chainIdToNameId[chainId];

      const _key = makeKey(walletAddress, chainId, page, limit);

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
            isActive: item[0][4],
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

      return {
        ...nameId,
        result: fetched,
      };
    }),
  );

  const result1 = result0.flatMap(item =>
    item.result.map(item2 => ({
      chainCode: item.chainCode,
      chainName: item.chainName,
      chainId: item.chainId,
      result: item2,
    })),
  );

  // sort is mutable
  result1.sort(
    (a, b) =>
      Number(a.result.presaleList.isActive) -
        Number(b.result.presaleList.isActive) ||
      b.result.createdAt - a.result.createdAt,
  );

  const result2 =
    typeof isActive === "boolean"
      ? result1.filter(item => item.result.presaleList.isActive === isActive)
      : result1;

  const result3 = result2.map(item => ({ ...item, result: [item.result] }));

  return result3;
};

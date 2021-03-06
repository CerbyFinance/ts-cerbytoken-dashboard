import { HttpsProxyAgent } from "hpagent";
import Web3 from "web3";
import { DefiFactoryToken } from "../../types/web3-v1-contracts/DefiFactoryToken";
import defiFactoryTokenAbi from "../contracts/DefiFactoryToken.json";
import { globalConfig } from "./config";

export const createAgent = (proxy: string) => {
  return new HttpsProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy,
    rejectUnauthorized: false,
  });
};

export const namedChains = [
  "eth",
  "bsc",
  "polygon",
  "avalanche",
  "fantom",
] as const;

export type NamedChains = typeof namedChains[number];

export const web3Map = Object.fromEntries(
  namedChains.map(item => [
    item,
    new Web3(
      new Web3.providers.HttpProvider(
        "https://secret:X4gDeGtfQy2M@" + item + "-node.valar-solutions.com/",
        {
          ...(globalConfig.isDevelopment
            ? {
                // agent: {
                //   https: createAgent("http://localhost:8883"),
                // },
              }
            : {}),
        },
      ),
    ),
  ]),
);

export const BUFFER_FUND_CONTRACT =
  "0x72aCC602f185692b80d66f933Bb679b04aD4583d";

export const STABLE_COIN_FUND_CONTRACT =
  "0x8149C0a6f5b5417d30F70e00a05d8D15CF471853";

export const STAKING_CONTRACT = "0x8888888AC6aa2482265e5346832CDd963c70A0D1";

export const DEFI_FACTORY_TOKEN_CONTRACT =
  "0xdef1fac7Bf08f173D286BbBDcBeeADe695129840";

// export const NOBOTS_CONTRACT = "0xDEF1Fa09538Ddd4CFe983d550D917Cd39D6ffE28";

export const TEAM_VESTING_CONTRACT =
  "0xDEF1fAE3A7713173C168945b8704D4600B6Fc7B9";

export const defiFactoryTokenContract = (web3: Web3) =>
  new web3.eth.Contract(
    // @ts-ignore
    defiFactoryTokenAbi,
    DEFI_FACTORY_TOKEN_CONTRACT,
  ) as unknown as DefiFactoryToken;

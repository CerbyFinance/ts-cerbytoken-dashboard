import fs from "fs";

type Token = {
  block: number;
  token: string;
  pair: string;
};

const ethTokens =
  `12789772:0x9f8eef61b1ad834b44c089dbf33eb854746a6bf9:0xaee132d8294b1531f21a432149ccf16d65f9abfa
12778623:0x2de72ada48bdf7bac276256d3f016fe058490c34:0xe571b939062474bfeb593a3f80fee9d2265b3b18
12746524:0x3de7148c41e3b3233f3310e794f68d8e70ca69af:0x7524c27965b26d13152835349bd10cc75f4643f1
12441422:0x387c291bc3274389054e82ce81dd318a0113caf5:0xbc8ed8c2ad89c14e55ee35d933f83e41cbd11121
12768546:0x976091738973b520a514ea206acdd008a09649de:0x68ca62c3c0cc90c6501181d625e94b4f0fdc869c
12782532:0xd0549d3c59facbd091e548600c1ec53d762aa66b:0xf951290ac7888145c1c643eba31868f899963299
12475858:0x714599f7604144a3fe1737c440a70fc0fd6503ea:0xfac2c7bc156c2c764ea21def2262ec2131100ab1
12601500:0x2b5ca2f9510cf1e3595ff219f24d75d4244585ea:0x376079a32d73b3942639486da4841ca31afa9960
12756808:0xd3d1615a2cdd71e209a3efb6a91fb9323bffd71d:0x07d4d6845e2c713de83a42bd56b0efcb2302c533
12686305:0xe2a083397521968eb05585932750634bed4b7d56:0x42c02c24caaf42a27dd95c790073a4ea3118ea48
12653883:0x3f9078b8fbcb1c4e03b41fa9e5a0532a28848db7:0x6bc4fbe8b72512d994fba72ade9de502b3d88ac4`
    .split("\n")
    .map(item => item.trim().split(":"))
    .map(item => ({
      block: Number(item[0]),
      token: item[1],
      pair: item[2],
    }));

const bscTokens =
  `8470811:0x7ee7f14427cc41d6db17829eb57dc74a26796b9d:0xd29b841852ded4bd3248f61a2f76b01306c865e2
7742738:0x7cf2cb3cd0a4b31a309b78526f33cedb7ced0766:0xc4684fa863b428503717eb320979b36e51a8172e
8348585:0x2020eb9e26aa49c27ebb72c174cfbab851f7dde0:0x0944512db237eb03a8a45d2cafbca513f6f7374d
8957548:0x96ac1e773677fa02726b5a670ca96a7adf7f8523:0xf40784c649790426cfe8e557ab96a7bbc313d216
8582515:0xaecf6d1aff214fef70042740054f0f6d0caa98ab:0xc5e1b7e86a63d23a88b85a0fe00772f058a4dcc4
8223538:0xc7d43f2b51f44f09fbb8a691a0451e8ffcf36c0a:0x93d94fcb0dcc8a88257b2d2eec7a2615ebedb542
8604905:0x3dab450ee6451762e72647a05a205dd5697c5c2c:0xd3d9b9e4201911f0d0feeceff4128f4d4046784b
8814816:0xba07eed3d09055d60caef2bdfca1c05792f2dfad:0x045b8c3b5e60780e3b42348baf39f2e0f3d7ffe5
8580860:0xc094b9604225062c7edca29db444b9b035f78c8b:0xfec01d8cefc67ed90d8fcad445ef04603ad546d2`
    .split("\n")
    .map(item => item.trim().split(":"))
    .map(item => ({
      block: Number(item[0]),
      token: item[1],
      pair: item[2],
    }));

const envTemplate = (
  chain: string,
  fetchAtOnce: number,
  pair: string,
  token: string,
  startBlock: number,
  weth: string,
  provider1: string,
  provider2: string,
) => `# db mongo (prod)
##############
MONGO_PORT_PROD=60001
MONGO_NAME_PROD=${chain + "-" + token}

SYNCTIME_FLASHBOTS=true

FETCH_AT_ONCE=${fetchAtOnce}
FLASHBOTS_URL=http://172.17.0.1:1102

# prod
COMMON_PROVIDER_PROD=${provider1}
ADDITIONAL_PROVIDER_PROD=${provider2}
DEFT_UNISWAP_PAIR_START_BLOCK_PROD=${startBlock}
DEFT_UNISWAP_PAIR_PROD=${pair}
DEFT_TOKEN_PROD=${token}
IS_CONTRACT_BULK_PROD=0x13882970C480EaFe5493Ef3DE2c6EF3DFA68E1F7
WETH_TOKEN_PROD=${weth}`;

// prettier-ignore
const deployAndUpdateTemplate = (chain: string, tokens: string[]) => `
docker stack deploy --resolve-image=never -c ./${chain}.yml ${chain}-bot-detector-stack` + '\n' + 
tokens.map(token => `docker service update --force ${chain}-bot-detector-stack_${token.slice(0, 16)} &`).join('\n')

const dockerComposeTemplate = (tokens: string[]) =>
  `
version: "3.7"
services:
  redis:
    image: redis:latest
    restart: always
    volumes:
      - shared-redis:/data
` +
  tokens
    .map(
      token => `  '${token.slice(0, 16)}':
    image: bot-detector-server
    environment:
      NODE_ENV: production
    restart: always
    env_file:
      - ./.env-${token}`,
    )
    .join("\n") +
  `
volumes:
  shared-redis:
`;

const ethAtOnce = 7200;
const bscAtOnce = 21600;

const create = (chain: string, tokens: Token[]) => {
  const path = chain + "-" + "deployment";

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  const isEth = chain === "eth";

  tokens.forEach(token => {
    const envToken = envTemplate(
      chain,
      isEth ? ethAtOnce : bscAtOnce,
      token.pair,
      token.token,
      token.block,
      isEth
        ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      isEth
        ? "http://secret:X4gDeGtfQy2M@eth-node.valar-solutions.com/"
        : "https://secret:X4gDeGtfQy2M@bsc-node.valar-solutions.com",
      isEth
        ? "https://eth-mainnet.alchemyapi.io/v2/xWjz3Gf53QIWM80eqYkYWXFAeGU3uU1R"
        : "https://speedy-nodes-nyc.moralis.io/5ad3eb59c21c59fd819ef6bd/bsc/mainnet/archive",
    );

    fs.writeFileSync(path + "/" + ".env-" + token.token, envToken);
  });

  const flatTokens = tokens.map(token => token.token);

  const deployAndUpdate = deployAndUpdateTemplate(chain, flatTokens);
  const dockerCompose = dockerComposeTemplate(flatTokens);

  fs.writeFileSync(path + "/" + "deploy-and-update.sh", deployAndUpdate);
  fs.writeFileSync(path + "/" + chain + ".yml", dockerCompose);
};

create("eth", ethTokens);
create("bsc", bscTokens);

export const chainCodeName = {
  1: "Ethereum",
  42: "Kovan Testnet",
  3: "Ropsten Testnet",
  56: "Binance",
  97: "Binance Testnet",
  137: "Polygon",
  80001: "Polygon Testnet",
} as { [key: number]: string };

export const chainCodeSymbol = {
  137: "MATIC",
  97: "tBNB",
  1: "ETH",
  80001: "MATIC",
  57: "BNB",
  42: "kETH",
  3: "rETH",
} as { [key: number]: string };

export const networkChainButton = {
  137: "polybtn",
  97: "bscbtn",
  1: "ethbtn",
  80001: "polybtn",
  57: "",
  42: "ethbtn",
  3: "polybtn",
} as { [key: number]: string };

export const progressGradientColor = {
  137: ["#782aff", "#bd29e9"],
  97: ["#ffb300", "#ff6f00"],
  1: ["#5294ff", "#29e994"],
  80001: ["#782aff", "#bd29e9"],
  57: ["", ""],
  42: ["#5294ff", "#29e994"],
  3: ["#782aff", "#bd29e9"],
} as { [key: number]: [string, string] };

export const RPC = {
  bsc: "",
};

// export const smartContractAddress: string = '0x132209d0F93eBFF185990D768126D32621F40c43';

export const networks = {
  "binance-test": [56, 97],
  eth: [1, 42, 3, 4, 5],
  pol: [137, 80001],
};

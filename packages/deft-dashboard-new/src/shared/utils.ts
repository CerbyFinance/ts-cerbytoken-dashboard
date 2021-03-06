import { Chains, PossibleChains } from "../chains";

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

declare global {
  interface Number {
    asCurrency(fractionDigits?: number): string;
  }
}

// @ts-ignore
// eslint-disable-next-line no-extend-native
Number.prototype.asCurrency = function (this: number, fractionDigits?: number) {
  return (
    fractionDigits ? this.toFixed(fractionDigits) : this.toString()
  ).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export function _isFinite(value: any): boolean {
  return typeof value == "number" && isFinite(value);
}

const ETHERSCAN_PREFIXES: { [chainId in PossibleChains]: string } = {
  1: "etherscan.io",
  43114: "snowtrace.io",
  250: "ftmscan.com",
  3: "ropsten.etherscan.io",
  4: "rinkeby.etherscan.io",
  5: "goerli.etherscan.io",
  42: "kovan.etherscan.io",
  56: "bscscan.com",
  137: "polygonscan.com",
  97: "testnet.bscscan.com",
};

export function getEtherscanLink(
  chainId: Chains,
  data: string,
  type: "transaction" | "tx" | "token" | "address" | "block",
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }`;

  // const prefix = `https://${
  //   ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[97]
  // }`;

  // const prefix = "https://testnet.bscscan.com";
  // const prefix = "https://ropsten.etherscan.io/";
  // const prefix = "https://etherscan.io/";

  switch (type) {
    case "transaction":
    case "tx": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

export const addToMetamask = async (provider: any) => {
  const tokenAddress = "0xdef1fac7bf08f173d286bbbdcbeeade695129840";
  const tokenSymbol = "CERBY";
  const tokenDecimals = 18;
  const tokenImage = "https://data.cerby.fi/imgs/logo/128.png";

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Your loss!");
    }
  } catch (error) {
    console.log(error);
  }
};

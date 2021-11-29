import { Web3Provider } from "@ethersproject/providers";

export const possibleChainIds = [
  1, 56, 3, 4, 5, 137, 42, 97, 250, 43114,
] as const;
export const supportedChainIds = [1, 56, 137, 250, 43114] as const;
// export const supportedChainIds = [42, 97] as const;

export type PossibleChains = typeof possibleChainIds[number];
export type Chains = typeof supportedChainIds[number];

type Chain = {
  chainId: number;
  explorer: string;
  label: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
};

export const chains = [
  {
    chainId: 1,
    explorer: "https://etherscan.io",
    label: "Ethereum",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [""],
  },
  {
    chainId: 56,
    explorer: "https://bscscan.com",
    label: "Binance",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
  },
  {
    chainId: 43114,
    explorer: "https://snowtrace.io",
    label: "Avalanche Mainnet",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  },
  {
    chainId: 250,
    explorer: "https://ftmscan.com",
    label: "Fantom Opera",
    nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
    rpcUrls: ["https://rpc.ftm.tools"],
  },
  {
    chainId: 137,
    explorer: "https://polygonscan.com/",
    label: "Matic",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
  },
  {
    chainId: 42,
    explorer: "https://kovan.etherscan.io",
    label: "Kovan",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [""],
  },
  {
    chainId: 42,
    explorer: "https://kovan.etherscan.io",
    label: "Kovan",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [""],
  },
  {
    chainId: 97,
    explorer: "https://testnet.bscscan.com",
    label: "Binance Testnet",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [""],
  },
] as Chain[];

interface AddNetworkInput {
  library: Web3Provider;
  chainId: Chains;
}

export async function addNetwork({
  library,
  chainId,
}: AddNetworkInput): Promise<null | void> {
  if (!library?.provider?.request) {
    return;
  }

  const chain = chains.find(item => item.chainId === chainId);

  if (!chain) {
    console.log("chain not found");
    return;
  }

  try {
    await library.provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + Number(chain.chainId).toString(16),
          chainName: chain.label,
          rpcUrls: chain.rpcUrls,
          nativeCurrency: chain.nativeCurrency,
          blockExplorerUrls: [chain.explorer],
        },
      ],
    });
  } catch (error) {
    console.error("error adding network: ", chainId, error);
  }
}

interface SwitchNetworkInput {
  library: Web3Provider;
  chainId: Chains;
}

export async function switchToNetwork({
  library,
  chainId,
}: SwitchNetworkInput): Promise<null | void> {
  if (!library?.provider?.request) {
    return;
  }
  if (!chainId && library?.getNetwork) {
    let result = await library.getNetwork();
    chainId = result.chainId as Chains;
  }

  try {
    await library.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + Number(chainId).toString(16) }],
    });

    if (chainId === 43114) {
      // avalanche bug
      window.location.reload();
    }
  } catch (error) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    // @ts-ignore
    if (error.code === 4902) {
      await addNetwork({ library, chainId });
      await switchToNetwork({ library, chainId });
    } else {
      throw error;
    }
  }
}

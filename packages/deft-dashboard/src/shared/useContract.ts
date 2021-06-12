import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { DefiFactoryTokenContract__factory } from "../types/ethers-contracts/factories/DefiFactoryTokenContract__factory";
import { NoBotsTechV2Contract__factory } from "../types/ethers-contracts/factories/NoBotsTechV2Contract__factory";

export function getSigner(
  library: Web3Provider,
  account: string,
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string | null,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

const NOBOTS_CONTRACT = "0xe0658E5D920c20eDb516b2d890aEfa77801559ce";
const TOKEN_CONTRACT = "0x9b8E6c833C2acd2a2013DD515DC165d57737cfc7";

export function useTokenContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = DefiFactoryTokenContract__factory.connect(
    TOKEN_CONTRACT,
    providerOrSigner,
  );

  return res;
}

export function useNobotsContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = NoBotsTechV2Contract__factory.connect(
    NOBOTS_CONTRACT,
    providerOrSigner,
  );

  return res;
}

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

const NOBOTS_CONTRACT = "0x51c26549c69b736664a852CC847B4c9954ECD7f7";
const TOKEN_CONTRACT = "0xB30Be87F1d795E88213Cc532a8EE42652A2DDaD3";

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

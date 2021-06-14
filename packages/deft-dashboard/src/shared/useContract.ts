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

const NOBOTS_CONTRACT = "0x0f93af197afd1fff963272a3d58e723c82eea77b";
const TOKEN_CONTRACT = "0xdef1fac7bf08f173d286bbbdcbeeade695129840";

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

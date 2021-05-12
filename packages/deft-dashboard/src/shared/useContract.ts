import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { DefiFactoryTokenContract__factory } from "../types/ethers-contracts";

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

const DEFT_KOVAN = "0x50f646bAE2A2C51Ac199C75117a86c5A150c72FB";

export function useDeftContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = DefiFactoryTokenContract__factory.connect(
    DEFT_KOVAN,
    providerOrSigner,
  );

  return res;
}

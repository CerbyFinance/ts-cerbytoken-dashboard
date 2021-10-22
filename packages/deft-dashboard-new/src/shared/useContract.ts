import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  MintableBurnableToken__factory,
  PresaleFactory__factory,
  Staking__factory,
} from "../types/ethers-contracts";

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

export function usePresaleContract(contractAddress: string) {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = PresaleFactory__factory.connect(
    contractAddress,
    providerOrSigner,
  );

  return res;
}

const STAKING_CONTRACT = "0x574B8e49BD71863a0108c85d8141473c9325cAe4";

export function useStakingContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = Staking__factory.connect(STAKING_CONTRACT, providerOrSigner);

  return res;
}

const TOKEN_CONTRACT = "0xe4DFe0FC73A9B9105Ed0422ba66084b47A32499F";

export function useTokenContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = MintableBurnableToken__factory.connect(
    TOKEN_CONTRACT,
    providerOrSigner,
  );

  return res;
}

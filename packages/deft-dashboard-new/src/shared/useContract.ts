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

const STAKING_CONTRACT = "0x5e47f81E613B0Dfb233E9de08DBE429C925be086";

export function useStakingContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = Staking__factory.connect(STAKING_CONTRACT, providerOrSigner);

  return res;
}

const TOKEN_CONTRACT = "0x7A7492a8e888Ca3fe8e31cB2E34872FE0CE5309f";

export function useTokenContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = MintableBurnableToken__factory.connect(
    TOKEN_CONTRACT,
    providerOrSigner,
  );

  return res;
}

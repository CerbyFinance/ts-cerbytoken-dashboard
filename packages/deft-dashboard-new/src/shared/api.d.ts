export interface PresaleList {
  presaleContractAddress: string;
  presaleName: string;
  totalInvestedWeth: number;
  maxWethCap: number;
  isActive: boolean;
  isEnabled: boolean;
  website: string;
  telegram: string;
}

export interface WalletInfo {
  walletAddress: string;
  walletInvestedWeth: number;
  walletReferralEarnings: number;
  minimumWethPerWallet: number;
  maximumWethPerWallet: number;
}

export interface VestingInfo {
  vestingAddr: string;
  tokensReserved: number;
  tokensClaimed: number;
  lockedUntilTimestamp: number;
  vestedUntilTimestamp: number;
}

export interface Tokenomic {
  tokenomicsAddr: string;
  tokenomicsName: string;
  tokenomicsPercentage: number;
  tokenomicsLockedForXSeconds: number;
  tokenomicsVestedForXSeconds: number;
  tokenomicsLockedFor: string;
  tokenomicsVestedFor: string;
}

export interface PresaleItem {
  chainId: number;
  presaleList: PresaleList;
  walletInfo: WalletInfo;
  vestingInfo: VestingInfo;
  tokenomics: Tokenomic[];
  listingPrice: number;
  createdAt: number;
}

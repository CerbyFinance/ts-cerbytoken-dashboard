export const possibleChainIds = [1, 56, 3, 4, 5, 137, 42, 97] as const;
export const supportedChainIds = [1, 56, 137] as const;
// export const supportedChainIds = [42, 97] as const;

export type PossibleChains = typeof possibleChainIds[number];
export type Chains = typeof supportedChainIds[number];

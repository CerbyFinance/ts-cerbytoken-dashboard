export const supportedChainIds = [1, 56, 3, 42, 97] as const;

export type Chains = typeof supportedChainIds[number];

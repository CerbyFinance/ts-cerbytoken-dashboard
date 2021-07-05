import { FieldPolicy } from "@apollo/client";

export const numberTypePolicy: FieldPolicy<number, string> = {
  // @ts-ignore
  merge: (_, incoming, a) => {
    return Number(incoming);
  },
};

export const scalarTypePolicies = {
  Global: {
    fields: {
      approvedCount: numberTypePolicy,
      mintedCount: numberTypePolicy,
      mintedAmount: numberTypePolicy,
      burnedCount: numberTypePolicy,
      burnedAmount: numberTypePolicy,
      chargedFee: numberTypePolicy,
      currentFee: numberTypePolicy,
    },
  },
  Proof: {
    fields: {
      nonce: numberTypePolicy,
      src: numberTypePolicy,
      dest: numberTypePolicy,
      // amount: numberTypePolicy,
      fee: numberTypePolicy,
      txFee: numberTypePolicy,
      logIndex: numberTypePolicy,
      blockNumber: numberTypePolicy,
      timestamp: numberTypePolicy,
    },
  },
};

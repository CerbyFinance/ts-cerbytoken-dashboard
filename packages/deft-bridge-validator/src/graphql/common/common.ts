import gql from "graphql-tag";

export const proofsQuery = gql`
  query Proofs(
    $first: Int!
    $blockNumber: BigInt!
    $proofType: ProofType
    $dest: BigInt!
  ) {
    proofs(
      first: $first
      where: { blockNumber_gt: $blockNumber, type: $proofType, dest: $dest }
      orderBy: blockNumber
      orderDirection: asc
    ) {
      id
      src
      dest
      logIndex
      blockNumber
      timestamp
    }
  }
`;

export const proofBlockNumberQuery = gql`
  query ProofBlockNumber($id: ID!) {
    proof(id: $id) {
      blockNumber
    }
  }
`;

export const globalRecentApprovedProofQuery = gql`
  query GlobalRecentProof {
    global(id: "1") {
      recentApprovedProof
    }
  }
`;

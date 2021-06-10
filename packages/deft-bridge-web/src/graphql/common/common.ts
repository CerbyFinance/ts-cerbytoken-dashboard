import gql from "graphql-tag";

export const metaBlockNumberQuery = gql`
  query MetaBlockNumber {
    _meta {
      block {
        number
      }
    }
  }
`;

export const proofByTxHashQuery = gql`
  query ProofByTxHash($txHash: Bytes!) {
    proofs(
      where: { txHash: $txHash }
      orderBy: nonce
      orderDirection: desc
      first: 1
    ) {
      id
      type
      src
      dest
      nonce
      sender
      amount
      fee
      txFee
    }
  }
`;

export const proofByIdQuery = gql`
  query ProofById($id: ID!, $proofType: ProofType!) {
    proofs(
      where: { id: $id, type: $proofType }
      orderBy: nonce
      orderDirection: desc
      first: 1
    ) {
      id
      type
      src
      dest
      nonce
      sender
      amount
      fee
      txFee
    }
  }
`;

export const myLastProofQuery = gql`
  query MyLastProof($sender: Bytes!, $proofType: ProofType!) {
    proofs(
      where: { sender: $sender, type: $proofType }
      orderBy: nonce
      orderDirection: desc
      first: 1
    ) {
      id
      type
      src
      dest
      nonce
      sender
      amount
      fee
      txFee
    }
  }
`;

export const bridgeTransferQuery = gql`
  query BridgeTransfer($id: ID!) {
    bridgeTransfer(id: $id) {
      id
      status
    }
  }
`;

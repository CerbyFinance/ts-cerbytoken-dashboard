import gql from "graphql-tag";

export const myLastProofQuery = gql`
  query MyLastProofQuery($sender: Bytes!, $proofType: ProofType!) {
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

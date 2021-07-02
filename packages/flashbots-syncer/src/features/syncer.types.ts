export interface Transaction {
  transaction_hash: string;
  tx_index: number;
  bundle_index: number;
  block_number: number;
  eoa_address: string;
  to_address: string;
  gas_used: number;
  gas_price: string;
  coinbase_transfer: string;
  total_miner_reward: string;
}

export interface Block {
  block_number: number;
  miner_reward: string;
  miner: string;
  coinbase_transfers: string;
  gas_used: number;
  gas_price: string;
  transactions: Transaction[];
}

export interface BlocksResult {
  blocks: Block[];
  latest_block_number: number;
}

export interface TransactionsResult {
  transactions: any[];
  latest_block_number: number;
}

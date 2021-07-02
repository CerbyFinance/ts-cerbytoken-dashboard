import { DeftTransactionRepository } from "./deft-transaction.service";

export class DeftTransactionFeedService {
  deftTransactionRepository = new DeftTransactionRepository();

  async feed<T extends "buy" | "sell" | "any">(
    fromBlockNumber: number,
    toBlockNumber: number,
    _limit: number,
    _page: number,
    type: T,
    orderBy: "ascending" | "descending",
    toIn: string[],
    recipientsIn: string[],
  ) {
    const limit = Math.min(Math.max(_limit, 1), 1000);
    const page = Math.max(_page, 1);

    const offset = (page - 1) * limit;

    if (fromBlockNumber > toBlockNumber) {
      return [];
    }

    const result = await this.deftTransactionRepository.feed(
      fromBlockNumber,
      toBlockNumber,
      limit,
      offset,
      type,
      orderBy,
      toIn,
      recipientsIn,
    );

    return result;
  }
}

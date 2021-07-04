import { DeftTransactionRepository } from "./deft-transaction.service";
import { request } from "./request";

const FLASHBOTS_URL = "http://localhost:3001";

const areFlashBots = async (transactions: string[]) => {
  const result = await request<{
    data: string[];
    message: string;
  }>({
    method: "POST",
    url: `${FLASHBOTS_URL}/flashbots/are-flash-bots`,
    json: {
      transactions,
    },
  });

  if (result instanceof Error) {
    return result;
  }

  return result.body.data;
};

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

    const transactions = result.map(item => item.txHash);

    const flashbots = await areFlashBots(transactions);

    if (flashbots instanceof Error) {
      return flashbots;
    }

    const flasbotsSet = new Set(flashbots);

    const resultWithFlashbots = result.map(item => {
      const isFlashBot = flasbotsSet.has(item.txHash);
      return {
        ...item,
        isFlashBot,
        isBot: isFlashBot ? true : item.isBot,
      };
    });

    return resultWithFlashbots;
  }
}

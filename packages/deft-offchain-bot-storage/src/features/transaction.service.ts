import { globalMongo } from "../utils/mongo";

const collectionName = "transactions";

export class TransactionRepository {
  async feed(
    fromBlockNumber: number,
    toBlockNumber: number,
    limit: number,
    offset: number,
    orderBy: "ascending" | "descending",
    toIn: string[],
    recipientsIn: string[],
  ) {
    const blockFilter = {
      blockNumber: {
        $gte: fromBlockNumber,
        $lte: toBlockNumber,
      },
      ...(toIn.length > 0
        ? {
            to: {
              $in: toIn,
            },
          }
        : {}),
      ...(recipientsIn.length > 0
        ? {
            "recipients.id": {
              $in: recipientsIn,
            },
          }
        : {}),
    };

    const ordering = orderBy === "descending" ? -1 : 1;

    const aggregatorOpts = [
      {
        $match: {
          ...blockFilter,
        },
      },
      { $sort: { blockNumber: ordering } },
      { $limit: offset + limit },
      { $skip: offset },
    ];

    const items = await globalMongo
      .collection(collectionName)
      .aggregate<{}>(aggregatorOpts, {
        collation: {
          locale: "en_US",
          strength: 1,
        },
      })
      .toArray();

    return items;
  }

  async areBots(addresses: string[]) {
    const aggregatorOpts = [
      {
        $match: {
          isBuy: true,
          isBot: true,
          // slippage: { $lte: 1 },
          recipients: {
            $elemMatch: {
              isNewHolder: true,
              isContract: false,
              $or: addresses.map(id => ({ id })),
            },
          },
        },
      },
      {
        $project: {
          recipients: {
            $map: {
              input: {
                $filter: {
                  input: "$recipients",
                  as: "item",
                  cond: {
                    $and: [
                      {
                        $eq: ["$$item.isNewHolder", true],
                      },
                      {
                        $eq: ["$$item.isContract", false],
                      },
                    ],
                  },
                },
              },
              as: "item",
              in: "$$item.id",
            },
          },
        },
      },
      { $unwind: "$recipients" },
      { $group: { _id: "recipients", res: { $addToSet: "$recipients" } } },
    ];

    const items = await globalMongo
      .collection(collectionName)
      .aggregate<{
        _id: string;
        res: string[];
      }>(aggregatorOpts, {
        collation: {
          locale: "en_US",
          strength: 1,
        },
      })
      .toArray();

    return items.length > 0 ? items[0].res : [];
  }
}

export class TransactionService {}

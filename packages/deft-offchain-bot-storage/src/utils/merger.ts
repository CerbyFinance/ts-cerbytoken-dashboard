import { MongoClient } from "mongodb";
import { createMongoConnectionString } from "./mongo";

const databases = [
  "bsc-0x2020eb9e26aa49c27ebb72c174cfbab851f7dde0",
  "bsc-0x7cf2cb3cd0a4b31a309b78526f33cedb7ced0766",
  "bsc-0x7ee7f14427cc41d6db17829eb57dc74a26796b9d",
  "bsc-0x96ac1e773677fa02726b5a670ca96a7adf7f8523",
  "bsc-0xaecf6d1aff214fef70042740054f0f6d0caa98ab",
  "bsc-0xba07eed3d09055d60caef2bdfca1c05792f2dfad",
  "bsc-0xc094b9604225062c7edca29db444b9b035f78c8b",
  "eth-0x2b5ca2f9510cf1e3595ff219f24d75d4244585ea",
  "eth-0x2de72ada48bdf7bac276256d3f016fe058490c34",
  "eth-0x387c291bc3274389054e82ce81dd318a0113caf5",
  "eth-0x3de7148c41e3b3233f3310e794f68d8e70ca69af",
  "eth-0x3f9078b8fbcb1c4e03b41fa9e5a0532a28848db7",
  "eth-0x714599f7604144a3fe1737c440a70fc0fd6503ea",
  "eth-0x976091738973b520a514ea206acdd008a09649de",
  "eth-0x9f8eef61b1ad834b44c089dbf33eb854746a6bf9",
  "eth-0xd0549d3c59facbd091e548600c1ec53d762aa66b",
  "eth-0xd3d1615a2cdd71e209a3efb6a91fb9323bffd71d",
  "eth-0xe2a083397521968eb05585932750634bed4b7d56",
];

const mergeThem = async () => {
  const url = createMongoConnectionString();
  const client = await MongoClient.connect(url);

  const dbToSave = client.db("offchain-bot-storage");
  const dbs = databases.map(db => client.db(db));

  for (const db of dbs) {
    console.log("db name: ", db.databaseName);
    const transactions = await db
      .collection("deft-transactions")
      .find({
        isBot: true,
        isBuy: true,
        slippage: { $lte: 1 },
      })
      .toArray();

    console.log("transactions count: ", transactions.length);

    await dbToSave.collection("transactions").insertMany(transactions);

    console.log("inserted ok");
  }
};

mergeThem();

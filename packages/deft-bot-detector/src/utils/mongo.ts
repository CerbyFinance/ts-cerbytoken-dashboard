import { Db, MongoClient } from "mongodb";
import { globalConfig } from "./config";

const dbName = "deft";

export let globalMongo = {} as Db;

export const createMongoConnectionString = () => {
  const { host, password, port, username } = globalConfig.isDevelopment
    ? globalConfig.development.mongodb
    : globalConfig.production.mongodb;

  return `mongodb://${username}:${password}@${host}:${port}/?authSource=admin`;
};

const startMongodbClient = async () => {
  const url = createMongoConnectionString();
  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  globalMongo = db;
};

export { startMongodbClient };

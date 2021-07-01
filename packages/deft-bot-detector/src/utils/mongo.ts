import { Db, MongoClient } from "mongodb";
import { globalConfig } from "./config";

const env = globalConfig.isDevelopment ? "development" : "production";

const dbName = globalConfig[env].mongodb.name;

export let globalMongo = {} as Db;

export const createMongoConnectionString = () => {
  const { host, password, port, username } = globalConfig[env].mongodb;

  return `mongodb://${username}:${password}@${host}:${port}/?authSource=admin`;
};

const startMongodbClient = async () => {
  const url = createMongoConnectionString();
  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  globalMongo = db;
};

export { startMongodbClient };

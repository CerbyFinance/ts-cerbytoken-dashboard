import Redis from "ioredis";
import { globalConfig } from "./config";

export const globalRedis = new Redis({
  host: globalConfig.isDevelopment ? "localhost" : "redis",
  port: Number(6379),
  db: 0,
});

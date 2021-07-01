import Redis from "ioredis";

export const globalRedis = new Redis({
  // host: globalConfig.isDevelopment ? "localhost" : "redis",
  host: "localhost",
  port: Number(6379),
  db: 0,
});

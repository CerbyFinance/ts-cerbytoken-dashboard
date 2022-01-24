import Redis from "ioredis";

export const globalRedis = new Redis({
  host: "redis",
  port: Number(6379),
  db: 0,
});

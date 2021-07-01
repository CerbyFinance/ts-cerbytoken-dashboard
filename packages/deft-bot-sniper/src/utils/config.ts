require("dotenv").config();

const { NODE_ENV, SNIPE_TIMEOUT } = process.env;

// @ts-ignore
const isJest = global.__DEV__;

const globalConfig = {
  isDevelopment: isJest || (NODE_ENV || "development") === "development",
  snipeTimeout: Number(SNIPE_TIMEOUT || 60),

  production: {},

  development: {},
};

export { globalConfig };

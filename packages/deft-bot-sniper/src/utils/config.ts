require("dotenv").config();

const { NODE_ENV } = process.env;

// @ts-ignore
const isJest = global.__DEV__;

const globalConfig = {
  isDevelopment: isJest || (NODE_ENV || "development") === "development",

  production: {},

  development: {},
};

export { globalConfig };

require("dotenv").config();

const { NODE_ENV } = process.env;

// @ts-ignore
const isJest = global.__DEV__;

export const globalConfig = {
  isDevelopment: isJest || (NODE_ENV || "development") === "development",
};

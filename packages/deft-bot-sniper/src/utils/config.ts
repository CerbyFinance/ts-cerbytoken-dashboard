require("dotenv").config();

const {
  NODE_ENV,
  SNIPE_TIMEOUT,
  FLASHBOTS_URL,
  DETECTOR_URL,
  PROJECT_NAME,
  START_FROM_BLOCK,

  DEFT_STORAGE,
  NODE_URL,
} = process.env;

// @ts-ignore
const isJest = global.__DEV__;

const globalConfig = {
  isDevelopment: isJest || (NODE_ENV || "development") === "development",
  snipeTimeout: Number(SNIPE_TIMEOUT || 60),

  deftStorage: DEFT_STORAGE!,
  nodeUrl: NODE_URL!,
  startFromBlock: Number(START_FROM_BLOCK!),
  projectName: PROJECT_NAME!,
  flashBotsUrl: FLASHBOTS_URL!,
  detectorUrl: DETECTOR_URL!,

  production: {
    contract: {},
  },
  development: {
    contract: {},
  },
};

export { globalConfig };

require("dotenv").config();

const {
  NODE_ENV,

  REDIS_HOST_PROD,
  REDIS_PORT_PROD,
  REDIS_PASSWORD_PROD,

  REDIS_HOST_DEV,
  REDIS_PORT_DEV,

  MONGO_USERNAME_PROD,
  MONGO_PASSWORD_PROD,
  MONGO_HOST_PROD,
  MONGO_PORT_PROD,
  MONGO_NAME_PROD,

  MONGO_USERNAME_DEV,
  MONGO_PASSWORD_DEV,
  MONGO_HOST_DEV,
  MONGO_PORT_DEV,
  MONGO_NAME_DEV,
} = process.env;

// @ts-ignore
const isJest = global.__DEV__;

const globalConfig = {
  isDevelopment: isJest || (NODE_ENV || "development") === "development",

  production: {
    redis: {
      host: REDIS_HOST_PROD!,
      port: REDIS_PORT_PROD!,
      pass: REDIS_PASSWORD_PROD!,
    },
    mongodb: {
      username: MONGO_USERNAME_PROD!,
      password: MONGO_PASSWORD_PROD!,
      host: MONGO_HOST_PROD!,
      port: MONGO_PORT_PROD!,
      name: MONGO_NAME_PROD!,
    },
  },

  development: {
    redis: {
      host: REDIS_HOST_DEV!,
      port: REDIS_PORT_DEV!,
      pass: undefined,
    },
    mongodb: {
      username: MONGO_USERNAME_DEV!,
      password: MONGO_PASSWORD_DEV!,
      host: MONGO_HOST_DEV!,
      port: MONGO_PORT_DEV!,
      name: MONGO_NAME_DEV!,
    },
  },
};

export { globalConfig };

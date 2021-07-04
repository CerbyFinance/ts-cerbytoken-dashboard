import got, { Options, RequestError } from "got";
import { HttpsProxyAgent } from "hpagent";

export const request = async <T>(
  options: Omit<Options, "isStream" | "resolveBodyOnly" | "responseType">,
  proxy?: string,
) => {
  const promise = got<T>({
    isStream: false,
    // resolveBodyOnly: true,
    responseType: "json",
    throwHttpErrors: false,

    decompress: true,

    methodRewriting: false,
    followRedirect: false,
    dnsCache: true,
    ...options,
  });

  try {
    const response = await promise;

    return response;
  } catch (error) {
    return error as RequestError;
  }
};

export const createAgent = (proxy: string) => {
  return new HttpsProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy,

    // rejectUnauthorized: false,
  });
};

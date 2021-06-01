import got, { Options, RequestError } from "got";

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

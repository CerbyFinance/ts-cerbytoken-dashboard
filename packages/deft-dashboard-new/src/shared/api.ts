import { PresaleItem } from "./api.d";

// const HOST = "http://localhost:3001";
const HOST = "https://api-launchpad.defifactory.fi/";

export class FError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, FError.prototype);
  }
}

interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

const handleError = <T>(response: ApiResponse<T>) => {
  const ok = response.status === "ok";

  if (ok) {
    return response;
  }

  const errorMessage = response.message || "unexpected error";

  return new FError(errorMessage);
};

interface PresaleFactorylistResponse
  extends ApiResponse<{
    result: PresaleItem[];
  }> {}

interface FetchPresaleListInput {
  walletAddress: string;
  isActive?: boolean;
  page: number;
  limit: number;
  chains: number[];
}

export const fetchPresaleList = async (input: FetchPresaleListInput) => {
  const response = (await fetch(`${HOST}/presale-factory/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then(r => r.json())) as PresaleFactorylistResponse;

  const possibleError = handleError(response);

  if (possibleError instanceof Error) {
    return possibleError;
  }

  return response.data.result;
};

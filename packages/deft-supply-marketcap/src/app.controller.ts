import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";
import { globalRedis } from "./utils/redis";

type Supplies = {
  totalSupply: number;
  lockedSupply: number;
  circulatingSupply: number;
};

type Prices = {
  priceDeftInEth: number;
  priceDeftInUsd: number;
};

type SupplyAndMarketCapResult = Prices &
  Supplies & {
    marketCap: number;
    totalDilutedMarketCap: number;
  };

const zero = {
  circulatingSupply: 0,
  lockedSupply: 0,
  marketCap: 0,
  priceDeftInEth: 0,
  priceDeftInUsd: 0,
  totalDilutedMarketCap: 0,
  totalSupply: 0,
} as SupplyAndMarketCapResult;

const supplyAndMarketCap = async () => {
  const suppliesStr = await globalRedis.get("supplies");
  const pricesStr = await globalRedis.get("prices");
  if (!suppliesStr || !pricesStr) {
    return zero;
  }

  const supplies = JSON.parse(suppliesStr) as Supplies;
  const prices = JSON.parse(pricesStr) as Prices;

  return {
    ...supplies,
    ...prices,
    marketCap: supplies.circulatingSupply * prices.priceDeftInUsd,
    totalDilutedMarketCap: supplies.totalSupply * prices.priceDeftInUsd,
  } as SupplyAndMarketCapResult;
};

@Controller("deft")
export class AppController {
  @Get("supply-marketcap")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async supplyAndMarketCap(): Promise<IApiResponse<AnyResponse>> {
    const result = await supplyAndMarketCap();

    return {
      data: result,
      message: "",
      status: "ok",
    };
  }
}

import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";
import { globalRedis } from "./utils/redis";

type Supplies = {
  // totalSupply: number;
  // lockedSupply: number;
  // circulatingSupply: number;

  totalDilutedSupply: number;
  stakedSupply: number;
  vestedSupply: number;
  circulatingSupply: number;
};

type Prices = {
  priceOnBsc: number;
  priceOnEth: number;
  priceOnPolygon: number;
  currentWeightedPrice: number;
};

type SupplyAndMarketCapResult = Prices &
  Supplies & {
    circulatingMarketCap: number;
    totalDilutedMarketCap: number;
  };

const zero = {
  circulatingSupply: 0,
  totalDilutedMarketCap: 0,
  currentWeightedPrice: 0,
  priceOnBsc: 0,
  priceOnEth: 0,
  priceOnPolygon: 0,
  stakedSupply: 0,
  totalDilutedSupply: 0,
  vestedSupply: 0,
  circulatingMarketCap: 0,
} as SupplyAndMarketCapResult;

const supplyAndMarketCap = async () => {
  const suppliesStr = await globalRedis.get("supplies");
  const pricesStr = await globalRedis.get("prices");
  const pairBalances = await globalRedis.get("pairBalances");
  if (!suppliesStr || !pricesStr || !pairBalances) {
    return zero;
  }

  const supplies = JSON.parse(suppliesStr) as Supplies;
  const prices = JSON.parse(pricesStr) as number[];
  const balances = JSON.parse(pairBalances) as number[];

  const numerator = prices
    .map((price, i) => price * balances[i])
    .reduce((acc, item) => acc + item, 0);
  const denominator = balances.reduce((acc, val) => acc + val, 0);

  const currentWeightedPrice = numerator / denominator;
  const totalDilutedMarketCap =
    supplies.totalDilutedSupply * currentWeightedPrice;

  const circulatingMarketCap =
    supplies.circulatingSupply * currentWeightedPrice;

  return {
    ...supplies,
    priceOnEth: prices[0],
    priceOnBsc: prices[1],
    priceOnPolygon: prices[2],

    currentWeightedPrice,
    circulatingMarketCap,

    totalDilutedMarketCap,
  } as SupplyAndMarketCapResult;
};

@Controller("cerby")
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

  @Get("total-supply")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async totalSupply(): Promise<AnyResponse> {
    const result = await supplyAndMarketCap();

    return result.totalDilutedSupply;
  }
}

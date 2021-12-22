import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";
import { globalRedis } from "./utils/redis";

type Combo = {
  from: string;
  to: string;
  buyAmount: number;
  sellAmount: number;
  profit: number;
};

type Funds = {
  bufferFund: number;
  stableCoinFund: number;
};

type Supplies = {
  // totalSupply: number;
  // lockedSupply: number;
  // circulatingSupply: number;

  totalDilutedSupply: number;
  stakedSupply: number;
  // vestedSupply: number;
  circulatingSupply: number;
};

type Prices = {
  priceOnBsc: number;
  priceOnEth: number;
  priceOnPolygon: number;
  priceOnAvalanche: number;
  priceOnFantom: number;
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
  priceOnAvalanche: 0,
  priceOnFantom: 0,
  stakedSupply: 0,
  totalDilutedSupply: 0,
  vestedSupply: 0,
  circulatingMarketCap: 0,
} as SupplyAndMarketCapResult;

const arbitrageCombos = async () => {
  const arbitrageCombosStr = await globalRedis.get("arbitrageCombos");

  if (!arbitrageCombosStr) {
    return [];
  }

  const parsed = JSON.parse(arbitrageCombosStr) as Combo[];

  return parsed;
};

const supplyAndMarketCap = async () => {
  const suppliesStr = await globalRedis.get("supplies");
  const pricesStr = await globalRedis.get("prices");
  const pairBalances = await globalRedis.get("pairBalances");
  const fundBalancesStr = await globalRedis.get("fundBalances");
  if (!suppliesStr || !pricesStr || !pairBalances || !fundBalancesStr) {
    return zero;
  }

  const supplies = JSON.parse(suppliesStr) as Supplies;
  const prices = JSON.parse(pricesStr) as number[];
  const balances = JSON.parse(pairBalances) as number[];
  const fundBalances = JSON.parse(fundBalancesStr) as Funds;

  const numerator = prices
    .map((price, i) => price * balances[i])
    .reduce((acc, item) => acc + item, 0);
  const denominator = balances.reduce((acc, val) => acc + val, 0);

  const currentWeightedPrice = numerator / denominator;
  const totalDilutedMarketCap =
    supplies.totalDilutedSupply * currentWeightedPrice;

  const circulatingSupply =
    supplies.totalDilutedSupply -
    supplies.stakedSupply -
    fundBalances.bufferFund -
    fundBalances.stableCoinFund;

  const circulatingMarketCap = circulatingSupply * currentWeightedPrice;

  return {
    ...supplies,
    ...fundBalances,
    priceOnEth: prices[0],
    priceOnBsc: prices[1],
    priceOnPolygon: prices[2],
    priceOnAvalanche: prices[3],
    priceOnFantom: prices[4],

    currentWeightedPrice,
    circulatingSupply,
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

  @Get("circulating-supply")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async circulatingSupply(): Promise<AnyResponse> {
    const result = await supplyAndMarketCap();

    return result.circulatingSupply;
  }
  @Get("arbitrage-opportunities")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async arbitrage(): Promise<AnyResponse> {
    const result = await arbitrageCombos();

    return {
      data: result,
      message: "",
      status: "ok",
    };
  }
}

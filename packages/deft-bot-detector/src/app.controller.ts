import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DeftTransactionFeedService } from "./features/deft-transaction-feed.service";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

@Controller("detector")
export class AppController {
  deftTransactionFeedService = new DeftTransactionFeedService();

  @Get("feed")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  @ApiQuery({ name: "toBlockNumber", type: Number })
  @ApiQuery({ name: "fromBlockNumber", type: Number })
  @ApiQuery({ name: "limit", type: Number })
  @ApiQuery({ name: "page", type: Number })
  @ApiQuery({
    name: "type",
    enum: ["buy", "sell", "any"],
  })
  @ApiQuery({
    name: "orderBy",
    enum: ["ascending", "descending"],
  })
  async wiseFeed(
    @Query("toBlockNumber") toBlockNumber: number,
    @Query("fromBlockNumber") fromBlockNumber: number,
    @Query("limit") limit: number,
    @Query("page") page: number,
    @Query("type") type: "buy" | "sell" | "any",
    @Query("orderBy") orderBy: "ascending" | "descending",
  ): Promise<IApiResponse<AnyResponse>> {
    const result = await this.deftTransactionFeedService.feed(
      Number(fromBlockNumber),
      Number(toBlockNumber),
      limit,
      page,
      type,
      orderBy,
    );

    return {
      data: result,
      message: "",
      status: "ok",
    };
  }
}

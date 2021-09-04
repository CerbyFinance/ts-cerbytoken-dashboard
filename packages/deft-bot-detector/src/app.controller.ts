import { Body, Controller, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiProperty, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DeftTransactionFeedService } from "./features/deft-transaction-feed.service";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

class FeedDTO {
  @ApiProperty({ default: [] })
  toIn!: string[];

  @ApiProperty({ default: [] })
  recipientsIn!: string[];
}

@Controller("detector")
export class AppController {
  deftTransactionFeedService = new DeftTransactionFeedService();

  @Post("feed")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  @ApiQuery({ name: "toBlockNumber", type: Number })
  @ApiQuery({ name: "fromBlockNumber", type: Number })
  @ApiQuery({ name: "limit", type: Number })
  @ApiQuery({ name: "page", type: Number })
  @ApiQuery({ name: "chainId", type: Number, required: false })
  @ApiQuery({ name: "token", type: String, required: false })
  @ApiQuery({ name: "fnName", type: String, required: false })
  @ApiQuery({ name: "isBot", type: Boolean, required: false })
  @ApiQuery({
    name: "type",
    enum: ["buy", "sell", "any"],
  })
  @ApiQuery({
    name: "orderBy",
    enum: ["ascending", "descending"],
  })
  @ApiBody({ required: true, type: FeedDTO })
  async feed(
    @Query("toBlockNumber") toBlockNumber: number,
    @Query("fromBlockNumber") fromBlockNumber: number,
    @Query("limit") limit: number,
    @Query("page") page: number,
    @Query("chainId") chainId: number,
    @Query("token") token: string,
    @Query("fnName") fnName: string,
    @Query("isBot") isBot: string,
    @Query("type") type: "buy" | "sell" | "any",
    @Query("orderBy") orderBy: "ascending" | "descending",
    @Body(new ValidationPipe({ transform: true })) input: FeedDTO,
  ): Promise<IApiResponse<AnyResponse>> {
    const result = await this.deftTransactionFeedService.feed(
      Number(fromBlockNumber),
      Number(toBlockNumber),
      limit,
      page,
      Number(chainId),
      token,
      fnName,
      typeof isBot === "string" ? (isBot === "true" ? true : false) : undefined,
      type,
      orderBy,
      input.toIn || [],
      input.recipientsIn || [],
    );

    return {
      data: result,
      message: "",
      status: "ok",
    };
  }
}

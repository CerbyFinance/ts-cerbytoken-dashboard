import { Body, Controller, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiProperty, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { TransactionRepository } from "./features/transaction.service";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

class AreBotsDTO {
  @ApiProperty()
  transactions!: string[];
}

class FeedDTO {
  @ApiProperty({ default: [] })
  toIn!: string[];

  @ApiProperty({ default: [] })
  recipientsIn!: string[];
}

@Controller("storage")
export class AppController {
  transactionRepository = new TransactionRepository();

  @Post("feed")
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
  @ApiBody({ required: true, type: FeedDTO })
  async feed(
    @Query("toBlockNumber") toBlockNumber: number,
    @Query("fromBlockNumber") fromBlockNumber: number,
    @Query("limit") _limit: number,
    @Query("page") _page: number,
    @Query("type") type: "buy" | "sell" | "any",
    @Query("orderBy") orderBy: "ascending" | "descending",
    @Body(new ValidationPipe({ transform: true })) input: FeedDTO,
  ): Promise<IApiResponse<AnyResponse>> {
    const limit = Math.min(Math.max(_limit, 1), 1000);
    const page = Math.max(_page, 1);

    const offset = (page - 1) * limit;

    if (fromBlockNumber > toBlockNumber) {
      return {
        data: [],
        message: "",
        status: "ok",
      };
    }

    const result = await this.transactionRepository.feed(
      Number(fromBlockNumber),
      Number(toBlockNumber),
      limit,
      offset,
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

  @Post("are-bots")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  @ApiBody({ required: true, type: AreBotsDTO })
  async areFlashBots(
    @Body(new ValidationPipe({ transform: true })) input: AreBotsDTO,
  ): Promise<IApiResponse<AnyResponse>> {
    const bots = await this.transactionRepository.areBots(input.transactions);

    return {
      data: bots,
      message: "",
      status: "ok",
    };
  }
}

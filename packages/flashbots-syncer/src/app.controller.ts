import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiProperty, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { BlockTransactionsRepository } from "./features/blocks-transactions.service";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

class AreFlashBotsDTO {
  @IsArray()
  @ApiProperty()
  transactions!: string[];
}

@Controller("flashbots")
export class AppController {
  blockTransactionsRepo = new BlockTransactionsRepository();

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
    name: "orderBy",
    enum: ["ascending", "descending"],
  })
  async feed(
    @Query("toBlockNumber") toBlockNumber: number,
    @Query("fromBlockNumber") fromBlockNumber: number,
    @Query("limit") _limit: number,
    @Query("page") _page: number,
    @Query("orderBy") orderBy: "ascending" | "descending",
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

    const result = await this.blockTransactionsRepo.feed(
      Number(fromBlockNumber),
      Number(toBlockNumber),
      limit,
      offset,
      orderBy,
    );

    return {
      data: result,
      message: "",
      status: "ok",
    };
  }

  @Post("are-flash-bots")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  @ApiBody({ required: true, type: AreFlashBotsDTO })
  async areFlashBots(
    @Body(new ValidationPipe({ transform: true })) input: AreFlashBotsDTO,
  ): Promise<IApiResponse<AnyResponse>> {
    const transactions = await this.blockTransactionsRepo.areFlashBots(
      input.transactions,
    );

    return {
      data: transactions,
      message: "",
      status: "ok",
    };
  }

  @Get("last-block")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async getLastBlock(): Promise<IApiResponse<AnyResponse>> {
    const lastBlock = await this.blockTransactionsRepo.getLastBlock();

    return {
      data: lastBlock?.blockNumber!,
      message: "",
      status: "ok",
    };
  }
}

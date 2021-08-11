import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiProperty, ApiResponse } from "@nestjs/swagger";
import { listPresales } from "./features/presales";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

class ListDTO {
  @ApiProperty()
  walletAddress!: string;

  @ApiProperty()
  isCompleted!: boolean;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty({ default: [] })
  chains!: string[];
}

@Controller("presale-factory")
export class AppController {
  @Post("list")
  @ApiBody({ required: true, type: ListDTO })
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async list(
    @Body(new ValidationPipe({ transform: true })) input: ListDTO,
  ): Promise<IApiResponse<AnyResponse>> {
    const result = await listPresales(
      input.walletAddress,
      input.chains,
      input.isCompleted,
      input.page,
      input.limit,
    );

    return {
      data: {
        result,
      },
      message: "",
      status: "ok",
    };
  }
}

import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { getPendingTransactions } from "./features/bridge";
import {
  AnyResponse,
  ApiAnyResponse,
  IApiResponse,
} from "./utils/nestjs.utils";

@Controller("deft-bridge")
export class AppController {
  @Get("pending-transactions")
  @ApiResponse({
    status: 200,
    type: ApiAnyResponse,
  })
  async pending(): Promise<IApiResponse<AnyResponse>> {
    const result = await getPendingTransactions();

    return {
      data: {
        transactions: result,
      },
      message: "",
      status: "ok",
    };
  }
}

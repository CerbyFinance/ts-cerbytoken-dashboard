import { ApiProperty } from "@nestjs/swagger";

export interface IApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export const createCustomApiResponse = <T extends object>(clazz: T) => {
  class ApiResponse implements IApiResponse<T> {
    @ApiProperty({ enum: ["ok", "error"] })
    status!: string;

    @ApiProperty({ required: false })
    message?: string;

    @ApiProperty({ type: clazz })
    data!: T;
  }

  Object.defineProperty(ApiResponse, "name", {
    get: function () {
      return `Api${(clazz as any).name}`;
    },
  });

  return ApiResponse;
};

export class AnyResponse {}
export const ApiAnyResponse = createCustomApiResponse(AnyResponse);

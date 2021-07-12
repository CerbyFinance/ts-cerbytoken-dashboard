import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

export const transformErrorToJSON = (exception: Error) => {
  const canBeExposed = [].some(err => exception instanceof err);

  let data = {} as any;

  return {
    status: "fail",
    message: canBeExposed
      ? exception.message
      : "Unexpected error, contact support",
    data,
  };
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error(exception.toString());
    console.error(exception.stack);

    const transformed = transformErrorToJSON(exception);

    response.status(200).json(transformed);
  }
}

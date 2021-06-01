import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AllExceptionsFilter } from "./utils/http-error.filter";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

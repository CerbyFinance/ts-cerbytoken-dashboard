import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { triggerRunJobs } from "./utils/run-jobs";

async function bootstrap() {
  triggerRunJobs();

  const app = await NestFactory.create(AppModule);

  let options = new DocumentBuilder()
    .setTitle("api")
    .setDescription("api description")
    .setVersion("1.0");

  const builtOptions = options.build();

  const document = SwaggerModule.createDocument(app, builtOptions);
  SwaggerModule.setup("api/docs", app, document);

  app.enableCors();

  await app.listen(3001);
}
bootstrap();

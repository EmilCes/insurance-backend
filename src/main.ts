import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { AnyExceptionFilter } from "./any-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    allowedHeaders: "Content-Type, Authorization",
  });

  app.useGlobalFilters(new AnyExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      validationError: { target: false, value: true },
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.use((req, res, next) => {
    console.log(`Solicitud entrante: ${req.method} ${req.url}`);
    next();
  });

  await app.listen(3002);
}
bootstrap();

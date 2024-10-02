import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT ?? 8000;
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT);
}

bootstrap();

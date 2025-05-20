import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();

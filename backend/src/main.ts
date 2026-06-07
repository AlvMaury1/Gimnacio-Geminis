 import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      app.enableCors(
    {
      origin: process.env.CORS_ORIGIN ??'http://localhost:5173',
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
    await app.listen(3000);

  }
  bootstrap();
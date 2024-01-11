import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './swagger/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = errors.map((error) => (
        error.constraints[Object.keys(error.constraints)[0]]
      ))
      return new BadRequestException(result[0]);
    }
  }));
  app.enableCors({
    credentials: true,
    origin:
      [
        'https://tarkhine.liara.run',
        'https://tarkhineh.liara.run',
        'http://localhost:3000'
      ],
    //preflightContinue: true,
  });
  app.setGlobalPrefix('v1');
  app.enableVersioning({ type: VersioningType.URI });
  SwaggerInit(app);
  const port = 3000;
  await app.listen(port, "0.0.0.0");
}
bootstrap();

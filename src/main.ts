import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './swagger/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AllowOrigins, HOST_PORT, PORT, compressionConfig } from './common/constant';
import { ErrorValidation } from './common/pipe';
import * as compression from 'compression'

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.use(helmet());

  app.setGlobalPrefix('v1');

  app.enableVersioning({
    type: VersioningType.URI
  });

  app.useGlobalPipes(
    ErrorValidation()
  );

  app.enableCors({
    credentials: true,
    origin: AllowOrigins
  });

  SwaggerInit(app);

  app.use(compression(compressionConfig));

  await app.listen(PORT, HOST_PORT);

}
bootstrap();

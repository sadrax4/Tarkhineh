import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './swagger/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression'
import { AllowOrigins, ErrorValidation, HOST, PORT, compressionConfig, myAuthorizer } from '@app/common';
import * as basicAuth from "express-basic-auth"
import { SwaggerDocument } from './swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.use(helmet());

  app.setGlobalPrefix('v1');

  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(ErrorValidation());

  app.enableCors({ credentials: true, origin: AllowOrigins });

  app.use(SwaggerDocument.PATH,
   
    basicAuth({
      challenge: true,
      users: {
        sadra: "123456",
      },
    })
  );

  SwaggerInit(app);

  app.use(compression(compressionConfig));



  await app.listen(PORT, HOST);

}
bootstrap();

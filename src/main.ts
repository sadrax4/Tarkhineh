import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerInit } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = errors.map((error) => (
        error.constraints[Object.keys(error.constraints)[0]]
      ))
      return new BadRequestException(result[0]);
    }
  }));
  app.setGlobalPrefix('v1');
  SwaggerInit(app);
  app.enableVersioning({ type: VersioningType.URI })
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, whitelist: true }));
  app.setGlobalPrefix('v1');
  app.enableVersioning({ type: VersioningType.URI })
  await app.listen(3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule {}

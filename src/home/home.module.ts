import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { FoodModule } from 'src/food/food.module';

@Module({
  imports: [
    FoodModule
  ],
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule {

}

import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { FoodRepository } from './db/food.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './db/food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }])
  ],
  providers: [
    FoodService,
    FoodRepository
  ],
  controllers: [FoodController]
})
export class FoodModule { }

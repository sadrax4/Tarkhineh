import { Module } from '@nestjs/common';
import { AdminFoodController } from './admin-food.controller';
import { AdminFoodService } from './admin-food.service';
import { FoodModule } from 'src/food/food.module';

@Module({
    imports: [
        FoodModule
    ],
    controllers: [
        AdminFoodController
    ],
    providers: [
        AdminFoodService
    ],
    exports: [AdminFoodService]
})
export class AdminFoodModule { }

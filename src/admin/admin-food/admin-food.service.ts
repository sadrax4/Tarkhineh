import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { FoodService } from 'src/food/food.service';

@Injectable()
export class AdminFoodService {
    constructor(
        private foodService: FoodService

    ) { }
    async getFoods(
        response: Response
    ): Promise<Response> {
        const foods = await this.foodService.getAllFoods();
        return response
            .status(HttpStatus.OK)
            .json({
                foods,
                statusCode: HttpStatus.OK
            })
    }
}

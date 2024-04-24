import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        try {
            const foods = await this.foodService.getAllFoods();
            return response
                .status(HttpStatus.OK)
                .json({
                    foods,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

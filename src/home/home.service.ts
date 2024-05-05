import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { FoodService } from 'src/food/food.service';
import { SearchDto } from './dto';


@Injectable()
export class HomeService {
    constructor(
        private foodService: FoodService
    ) { }

    async search(
        search: string,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const foods = await this.foodService.homeSearchFood(
                search,
                phone
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    foods,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            console.log(error);
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

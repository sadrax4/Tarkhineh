import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { FoodService } from 'src/food/food.service';
import { SearchDto } from './dto';


@Injectable()
export class HomeService {
    constructor(
        private foodService: FoodService
    ) { }

    async search(
        { search }: SearchDto,
        response: Response
    ): Promise<Response> {
        const foods = await this.foodService.homeSearchFood(search)
        return response
            .status(HttpStatus.OK)
            .json({
                foods,
                statusCode: HttpStatus.OK
            })
    }
}

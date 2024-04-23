import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { FoodService } from 'src/food/food.service';


@Injectable()
export class HomeService {
    constructor(
        private foodService: FoodService
    ) { }

    async search(
        response: Response
    ): Promise<Response> {
    
        return response
            .status(HttpStatus.OK)
            .json({
                message: "کاربر با موفقیت حذف شد",
                statusCode: HttpStatus.OK
            })
    }
}

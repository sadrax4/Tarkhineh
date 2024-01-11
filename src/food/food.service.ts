import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue } from 'src/common/utils';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { Types } from 'mongoose';

@Injectable()
export class FoodService {
    constructor(
        private readonly foodRepository: FoodRepository
    ) { }

    async createFood(
        createFoodDto: CreateFoodDto,
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createFoodDto);
        try {
            const foodData = {
                _id: new Types.ObjectId(),
                ...createFoodDto
            }
            await this.foodRepository.create(foodData);
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "غذا با موفقیت ثبت شد",
                statusCode: HttpStatus.CREATED
            })
    }
}

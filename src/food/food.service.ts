import { Injectable } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto } from './dto';
import { Response } from 'express';

@Injectable()
export class FoodService {
    constructor(
        private readonly foodRepository: FoodRepository
    ) { }

    async createFood(
        createFoodDto: CreateFoodDto,
        response: Response
    ){
        
    }
}

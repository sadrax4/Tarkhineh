import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue } from 'src/common/utils';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

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

    async getFoods(
        response: Response
    ): Promise<Response> {
        try {
            const foods = await this.foodRepository.find({});
            return response
                .status(HttpStatus.OK)
                .json({
                    data: foods,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getFoodById(
        foodId: string,
        response: Response
    ): Promise<Response> {
        try {
            const food = await this.foodRepository.findOne({
                _id: new ObjectId(foodId)
            })
            if (!food) {
                return response
                    .status(HttpStatus.OK)
                    .json({
                        message: "غذایی یافت نشد",
                        statusCode: HttpStatus.NOT_FOUND
                    })
            }
            return response
                .status(HttpStatus.OK)
                .json({
                    data: food,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteFoodById(
        foodId: string,
        response: Response
    ): Promise<Response> {
        try {
            const food = await this.foodRepository.deleteOne({
                _id: new ObjectId(foodId)
            })
            if (!food) {
                return response
                    .status(HttpStatus.OK)
                    .json({
                        message: "غذایی یافت نشد",
                        statusCode: HttpStatus.NOT_FOUND
                    })
            }
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "غذا با موفقیت حذف شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateFoodComment(
        foodId: string,
        commentId: ObjectId,
    ): Promise<void> {
        try {
            await this.foodRepository.findOneAndUpdate(
                { _id: new ObjectId(foodId) },
                {
                    $push: {
                        comments: commentId
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async deleteComment(
        commentId: string
    ): Promise<void> {
        try {
            await this.foodRepository.findOneAndUpdate(
                {
                    comments: {
                        $in: new mongoose.Types.ObjectId(commentId)
                    }
                },
                {
                    $pull: {
                        ['comments']: new mongoose.Types.ObjectId(commentId)
                    }
                }
            )

        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getComments(
        foodId: string
    ): Promise<object> {
        try {
            const commentProjection = {
                title: 0,
                _id: 0,
                ingredients: 0,
                description: 0,
                price: 0,
                discount: 0,
                quantity: 0,
                mainCategory: 0,
                subCategory: 0,
                images: 0
            }
            const [comments] = await this.foodRepository.aggregate([
                {
                    $match: {
                        '_id': new mongoose.Types.ObjectId(foodId)
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'comments',
                        foreignField: '_id',
                        as: 'comments'
                    },
                },
                {
                    $project: commentProjection
                }
            ])
            return comments;
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

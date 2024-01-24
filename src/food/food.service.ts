import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue } from 'src/common/utils';
import { DEFAULT_CATEGORY, FOOD_FOLDER, INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StorageService } from 'src/storage/storage.service';
import { Food } from './db/food.schema';

@Injectable()
export class FoodService {
    constructor(
        private readonly foodRepository: FoodRepository,
        private storageService: StorageService
    ) { }

    async createFood(
        createFoodDto: CreateFoodDto,
        images: Express.Multer.File[],
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createFoodDto);
        createFoodDto.imagesUrl = images.map(
            image => {
                return this.storageService.getFileLink(
                    image.filename,
                    FOOD_FOLDER
                )
            })
        const foodData = {
            _id: new Types.ObjectId(),
            ...createFoodDto,
        }

        try {
            await Promise.all([
                this.storageService.uploadMultiFile(
                    images,
                    FOOD_FOLDER
                ),
                this.foodRepository.create(
                    foodData
                )
            ])
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

    async getFoodsByCategory(
        mainCategory: string = null,
        subCategory: string = null,
        response: Response
    ): Promise<Response> {
        let foods: Food[];
        try {
            if (!mainCategory && !subCategory) {
                foods = await this.foodRepository.find({
                    category: DEFAULT_CATEGORY
                });
            } else if (mainCategory && !subCategory) {
                foods = await this.foodRepository.find({
                    category: mainCategory
                });
            }
            else if (mainCategory && subCategory) {
                foods = await this.foodRepository.find({
                    category: mainCategory,
                    subCategory
                });
            }
            const categories = {
                category: mainCategory ? mainCategory : DEFAULT_CATEGORY,
                subCategory: subCategory ? subCategory : null
            }
            deleteInvalidValue(categories)
            return response
                .status(HttpStatus.OK)
                .json({
                    data: foods,
                    ...categories,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
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

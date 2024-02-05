import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto, UpdateFoodDto } from './dto';
import { Response } from 'express';
import { calculatePrice, deleteInvalidValue, pagination } from 'src/common/utils';
import { FOOD_FOLDER, INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StorageService } from 'src/storage/storage.service';
import { CommentService } from 'src/comment/comment.service';
import { FoodDetailProjection, getCommentsByFoodIdProjection, getFavoriteFoodProjection, getFoodByCategoryProjection, groupAggregate, groupAggregateFavoriteFood, projectAggregate, projectAggregateFavoriteFood } from 'src/common/projection';
import { UserService } from '../user/user.service';

@Injectable()
export class FoodService {
    constructor(
        private readonly foodRepository: FoodRepository,
        private readonly storageService: StorageService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => CommentService))
        private readonly commentService: CommentService
    ) { }

    async createFood(
        createFoodDto: CreateFoodDto,
        images: Express.Multer.File[],
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createFoodDto);
        createFoodDto.images = images.map(
            image => image.filename
        )
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

    async updateFood(
        foodId: string,
        updateFoodDto: UpdateFoodDto,
        images: Express.Multer.File[],
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(updateFoodDto);
        if (images) {
            updateFoodDto.images = images.map(
                image => image.filename
            )
            updateFoodDto.imagesUrl = images.map(
                image => {
                    return this.storageService.getFileLink(
                        image.filename,
                        FOOD_FOLDER
                    )
                })
        }
        try {
            await Promise.all([
                this.storageService.uploadMultiFile(
                    images,
                    FOOD_FOLDER
                ),
                this.foodRepository.findOneAndUpdate(
                    {
                        _id: new Types.ObjectId(foodId)
                    },
                    {
                        $set: updateFoodDto
                    }
                )
            ])
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.OK)
            .json({
                message: "غذا با موفقیت به روز رسانی  شد",
                statusCode: HttpStatus.OK
            })

    }

    async getFoodsByCategory(
        phone: string,
        query: string,
        mainCategory: string,
        subCategory: string,
        page: number,
        limit: number,
        response: Response
    ): Promise<Response> {
        let matchStage = [];
        if (query) {
            matchStage.push({
                $match: {
                    title: {
                        $regex: `[a-zA-Z]*${query}[a-zA-Z]*`
                    }
                }
            })
        }
        if (mainCategory) {
            matchStage.push({
                $match: {
                    "category": mainCategory
                }
            })
        }
        if (subCategory) {
            matchStage.push({
                $match: {
                    "subCategory": subCategory
                }
            })
        }
        const pipeLine = [
            ...matchStage,
            {
                $group: groupAggregate
            },
            {
                $project: projectAggregate
            },
            {
                $unwind: '$subCategory'
            },
            {
                $project: getFoodByCategoryProjection
            },
            {
                $sort: {
                    "subCategory": 1
                }
            }
        ]
        try {
            let foods = await this.foodRepository.aggregate(
                pipeLine
            );
            const maxPage = Math.ceil(
                foods?.length / limit
            )
            foods = pagination(
                foods,
                limit,
                page
            );
            const favoriteFood = await this.userService.getFavoriteFoodId(
                phone
            );
            foods.forEach(
                food => {
                    food.data.forEach(
                        fd => {
                            if (fd.discount > 0) {
                                fd.newPrice = calculatePrice(fd.price, fd.discount);
                            }
                            fd.isFavorite = favoriteFood ?
                                favoriteFood.includes(new Types.ObjectId(fd._id)) : false;
                        }
                    )
                }
            );
            return response
                .status(HttpStatus.OK)
                .json({
                    foods,
                    maxPage,
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

    async getAllFoods() {
        try {
            return await this.foodRepository.find({});
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getFoodById(
        foodId: string,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const foodQuery: any = this.foodRepository.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(foodId),
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        foreignField: "_id",
                        localField: "comments",
                        as: 'comments'
                    }
                },
                {
                    $unwind: "$comments"
                },
                {
                    $lookup: {
                        from: 'user',
                        let: { foreignId: { $toObjectId: '$comments.author' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$foreignId']
                                    }
                                }
                            }
                        ],
                        as: 'comments.author'
                    }
                },
                {
                    $project: FoodDetailProjection
                }
            ])
            const favoriteFoodQuery = this.userService.getFavoriteFoodId(
                phone
            )
            const [
                foods,
                favoritFood
            ] = await Promise.all([
                foodQuery,
                favoriteFoodQuery
            ])
            let comments = foods.map(fd => {
                return fd?.comments;
            })
            let food = foods[0];
            comments ? food.comments = comments : null;
            food.isFavorite = favoritFood.includes(new Types.ObjectId(food._id)) ?
                true : false
            if (food.discount > 0) {
                food.newPrice = calculatePrice(
                    food.price,
                    food.discount
                )
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
        commentRate: number
    ): Promise<void> {
        try {
            let calculateRate: number;
            const { rate, rateCount } = await this.foodRepository.findOne({
                _id: new Types.ObjectId(foodId)
            });
            if (rate == 1 && rateCount == 0) {
                calculateRate = commentRate
            }
            else {
                calculateRate = (((rate * rateCount) + commentRate) / (rateCount + 1));
            }
            await this.foodRepository.findOneAndUpdate(
                { _id: new ObjectId(foodId) },
                {
                    $push: {
                        comments: commentId,
                    },
                    $set: {
                        rate: calculateRate
                    },
                    $inc: {
                        rateCount: 1
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

    async getCommentsByFoodId(
        foodId: string
    ): Promise<object> {
        try {
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
                    $project: getCommentsByFoodIdProjection
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

    async searchFood(
        searchQuery: string,
        response: Response
    ) {
        const regexPattern = `[a-zA-Z]*${searchQuery}[a-zA-Z]*`;
        try {
            const foods = await this.foodRepository.find({
                $or: [
                    {
                        $text: {
                            $search: searchQuery
                        }
                    },
                    {
                        title: {
                            $regex: regexPattern
                        }
                    },
                    {
                        description: {
                            $regex: regexPattern
                        }
                    }
                ]
            })
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

    async getFavoriteFood(
        favoriteFoodId: ObjectId[],
        mainCategory: string,
        page: number,
        limit: number,
        query: string
    ) {
        let matchStage = [];
        if (query) {
            matchStage.push({
                $match: {
                    title: {
                        $regex: `[a-zA-Z]*${query}[a-zA-Z]*`
                    }
                }
            })
        }
        if (mainCategory) {
            matchStage.push({
                $match: {
                    "category": mainCategory
                }
            })
        }
        const pipeLine = [
            {
                $match: {
                    _id: {
                        $in: favoriteFoodId
                    }
                }
            },
            ...matchStage,
            {
                $project: getFavoriteFoodProjection
            }
        ]
        try {
            let foods = await this.foodRepository.aggregate(
                pipeLine
            );
            foods.forEach(
                fd => {
                    if (fd.discount > 0) {
                        fd.newPrice = calculatePrice(fd.price, fd.discount);
                    }
                    fd.isFavorite = true
                }
            )
            return foods;
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

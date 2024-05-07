import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { FoodRepository } from './db/food.repository';
import { CreateFoodDto, UpdateFoodDto } from './dto';
import { Response } from 'express';
import { calculatePrice, deleteInvalidValue, pagination, FOOD_FOLDER, INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StorageService } from 'src/storage/storage.service';
import { CommentService } from 'src/comment/comment.service';
import { FoodDetailProjection, getCommentsByFoodIdProjection, getFavoriteFoodProjection, getFoodByCategoryProjection, groupAggregate, projectAggregate } from '@app/common';
import { UserService } from '../user/user.service';
import { Food } from './db/food.schema';

@Injectable()
export class FoodService {
    constructor(
        private readonly foodRepository: FoodRepository,
        private readonly storageService: StorageService,
        @Inject(forwardRef(() => UserService))
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
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
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
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
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
        if (subCategory && subCategory != "پرفروش ترین" && subCategory != "اقتصادی ترین") {
            matchStage.push({
                $match: {
                    "subCategory": subCategory
                }
            })
        } else if (subCategory == "پرفروش ترین") {
            console.log('2')
            matchStage.push({
                $match: {
                    "subCategory": "پیتزاها"
                }
            })
        } else if (subCategory == "اقتصادی ترین") {
            console.log('3')
            matchStage.push({
                $match: {
                    "subCategory": "ساندویچ ها"
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

    async getAllFoods() {
        try {
            return await this.foodRepository.find({});
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
                    "$unwind": {
                        path: "$comments",
                        preserveNullAndEmptyArrays: true
                    }
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
            let comments = foods
                .map(
                    fd => {
                        return fd?.comments?.show ? fd.comments : null
                    })
                .filter(
                    comment => comment !== null
                )
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
            },
            {
                $sort: {
                    "title": 1
                }
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

    async getPrice(
        foodId: string
    ): Promise<number> {
        try {
            let foodPrice: number;
            const food = await this.foodRepository.findOne(
                { _id: new Types.ObjectId(foodId) },
                {
                    discount: 1,
                    price: 1,
                    _id: false
                }
            )
            if (food.discount > 0) {
                foodPrice = calculatePrice(food.price, food.discount);
            } else {
                foodPrice = food.price;
            }
            return foodPrice;
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

    async checkFoodQuantity(
        foodId: string,
        count: number = 1
    ): Promise<void> {
        try {
            const { quantity }: Pick<Food, "quantity"> = await this.foodRepository.findOne(
                { _id: new Types.ObjectId(foodId) },
                {
                    quantity: 1,
                    _id: false
                }
            )
            const remainingFood = Number(quantity) - Number(count);
            if (remainingFood <= 0) {
                throw new HttpException(
                    "  متاسفانه موجودی غذا از تعداد درخواستی شما کمتر است",
                    HttpStatus.UNPROCESSABLE_ENTITY
                )
            }
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

    async homeSearchFood(
        search: string,
        phone: string
    ): Promise<any> {
        try {
            const regexPattern = `[a-zA-Z]*${search}[a-zA-Z]*`;
            let foods: any = await this.foodRepository.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $text: {
                                    $search: search
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
                    }

                }
            ])
            const favoriteFood = await this.userService.getFavoriteFoodId(
                phone
            );
            foods.forEach(
                fd => {
                    if (fd.discount > 0) {
                        fd.newPrice = calculatePrice(fd.price, fd.discount);
                    }
                    fd.isFavorite = favoriteFood ?
                        favoriteFood.includes(new Types.ObjectId(fd._id)) : false;
                }
            )
            return foods;
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto';
import { UserService } from 'src/user/user.service';
import { CommentRepository } from './db/comment.repository';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { FoodService } from 'src/food/food.service';
import { deleteInvalidValue } from 'src/common/utils';


@Injectable()
export class CommentService {

    constructor(
        private userService: UserService,
        private foodService: FoodService,
        private commentRepository: CommentRepository
    ) { }

    async createComment(
        createCommentDto: CreateCommentDto,
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createCommentDto);
        try {
            const phone: string = createCommentDto.author;
            const { _id: userId } = await this.userService.findUser(phone);
            createCommentDto.author = userId.toString();
            const commentData = {
                _id: new Types.ObjectId(),
                ...createCommentDto
            }
            const createCommentQuery = this.commentRepository.create(
                commentData
            );
            const updateUserCommentQuery = this.userService.updateComment(
                userId.toString(),
                commentData._id
            )
            const updateFoodCommentQuery = this.foodService.updateFoodComment(
                createCommentDto.foodId.toString(),
                commentData._id
            )
            await Promise.all([
                createCommentQuery,
                updateUserCommentQuery,
                updateFoodCommentQuery
            ])
            return response
                .status(HttpStatus.CREATED)
                .json({
                    message: "کامنت با موفقیت ثبت شد",
                    statusCode: HttpStatus.CREATED
                })
        } catch (error) {
            throw new HttpException(
                INTERNAL_SERVER_ERROR_MESSAGE,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

    }
    async IsShowComment(
        commentId: string,
        show: boolean,
        response: Response
    ) {
        try {
            await this.commentRepository.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(commentId) },
                {
                    $set: {
                        show
                    }
                }
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "نمایش کامنت به روز رسانی شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                INTERNAL_SERVER_ERROR_MESSAGE,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getComments(
        response: Response
    ) {
        try {
            const comments = await this.commentRepository.find({})
            return response
                .status(HttpStatus.OK)
                .json({
                    data: comments,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                INTERNAL_SERVER_ERROR_MESSAGE,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteComment(
        commentId: string,
        response: Response
    ) {
        try {
            const deleteCommentQuery = this.commentRepository.deleteOne({
                _id: new mongoose.Types.ObjectId(commentId)
            })
            const deleteFoodCommentQuery = this.foodService.deleteComment(
                commentId
            )
            const deleteUserCommentQuery = this.userService.deleteComment(
                commentId
            )
            await Promise.all([
                deleteCommentQuery,
                deleteFoodCommentQuery,
                deleteUserCommentQuery
            ])
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "کامنت با موفقیت حذف شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                INTERNAL_SERVER_ERROR_MESSAGE,
                HttpStatus.INTERNAL_SERVER_ERROR
            )

        }
    }

    async getFoodComments(
        foodId: string,
        response: Response
    ) {
        const comments = await this.foodService.getComments(foodId);
        return response
            .status(HttpStatus.OK)
            .json({
                data: comments,
                statusCode: HttpStatus.OK
            })
    }

    async getUserComments(
        userId: string,
        response: Response
    ) {
        const comments = await this.userService.getComments(userId);
        return response
            .status(HttpStatus.OK)
            .json({
                data: comments,
                statusCode: HttpStatus.OK
            })
    }
}

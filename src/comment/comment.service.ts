import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateCommentDto, ReplyCommentDto } from './dto';
import { UserService } from 'src/user/user.service';
import { CommentRepository } from './db/comment.repository';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';
import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { FoodService } from 'src/food/food.service';
import { deleteInvalidValue } from '@app/common';
import { Comment } from './db/comment.schema';

@Injectable()
export class CommentService {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => FoodService))
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
                commentData._id,
                createCommentDto.rate
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

    async replyComment(
        phone: string,
        id: string,
        replyCommentDto: ReplyCommentDto,
        response: Response
    ): Promise<Response> {
        try {
            const {
                name,
                family,
                imageUrl
            } = await this.userService.findUser(phone);
            const replyData = {
                author: [{
                    name,
                    family,
                    imageUrl
                }],
                text: replyCommentDto.text,
            }
            await this.commentRepository.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                {
                    $set: {
                        reply: replyData,
                        show: true
                    }
                }
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "پاسخ به کامنت با موفقیت ثبت شد ",
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

    async editReplyComment(
        phone: string,
        id: string,
        replyCommentDto: ReplyCommentDto,
        response: Response
    ): Promise<Response> {
        try {
            const {
                name,
                family,
                imageUrl
            } = await this.userService.findUser(phone);
            const replyData = {
                author: [{
                    name,
                    family,
                    imageUrl
                }],
                text: replyCommentDto.text
            }
            await this.commentRepository.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                {
                    $set: {
                        reply: replyData,
                        show: true
                    }
                }
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "پاسخ به کامنت با موفقیت به روز رسانی  شد ",
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

    async IsShowComment(
        commentId: string,
        show: boolean,
        response: Response
    ): Promise<Response> {
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

    async getComments(
        response: Response
    ): Promise<Response> {
        try {
            const comments: Comment[] = await this.commentRepository.find({});
            return response
                .status(HttpStatus.OK)
                .json({
                    data: comments,
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

    async deleteComment(
        commentId: string,
        response: Response
    ): Promise<Response> {
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

    async getFoodComments(
        foodId: string,
        response: Response
    ): Promise<Response> {
        try {
            const comments = await this.foodService.getCommentsByFoodId(foodId);
            return response
                .status(HttpStatus.OK)
                .json({
                    data: comments,
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

    async getUserComments(
        userId: string,
        response: Response
    ): Promise<Response> {
        try {
            const comments = await this.userService.getComments(userId);
            return response
                .status(HttpStatus.OK)
                .json({
                    data: comments,
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

    async getCommentById(
        commentId: string,
        response: Response
    ): Promise<Response> {
        try {
            const comments = await this.commentRepository.findOne({
                _id: new Types.ObjectId(commentId)
            });
            return response
                .status(HttpStatus.OK)
                .json({
                    data: comments,
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
}

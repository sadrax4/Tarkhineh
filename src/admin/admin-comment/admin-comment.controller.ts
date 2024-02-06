import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guards';
import { CommentService } from 'src/comment/comment.service';
import { IsShowCommentDto, ReplyCommentDto } from 'src/comment/dto';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';

@Controller('admin')
export class AdminCommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @UseGuards(AdminGuard)
    @ApiTags('admin-comment')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("comments")
    async getComments(
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.getComments(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-comment')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete("comments/:id")
    async deleteComment(
        @Res() response: Response,
        @Param("id") commentId: string
    ): Promise<Response> {
        return this.commentService.deleteComment(
            commentId,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-comment')
    @ApiBody({
        type: IsShowCommentDto
    })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch('show/:id')
    async isShowComment(
        @Body() isShowCommentDto: IsShowCommentDto,
        @Param("id") commentId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.IsShowComment(
            commentId,
            isShowCommentDto.show,
            response
        )
    };

    @UseGuards(AdminGuard)
    @ApiTags('admin-comment')
    @ApiBody({
        type: ReplyCommentDto
    })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post('comment/reply/:id')
    async replyComment(
        @Body() replyCommentDto: ReplyCommentDto,
        @Query("id") id: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.replyComment(
            id,
            replyCommentDto,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-comment')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("comments/:id")
    async findCommentById(
        @Res() response: Response,
        @Param("id") commentId: string
    ): Promise<Response> {
        return this.commentService.getCommentById(
            commentId,
            response
        )
    }
}

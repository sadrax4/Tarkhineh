import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage, GetCurrentUser } from '@app/common';
import { CreateCommentDto, IsShowCommentDto, ReplyCommentDto } from './dto';
import { AdminGuard, JwtGuard } from 'src/auth/guards';
import { CommentService } from './comment.service';
import { Response } from 'express';

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "create comment " })
    @ApiBody({ type: CreateCommentDto })
    @ApiTags('comment')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post()
    async createComment(
        @GetCurrentUser('phone') phone: string,
        @Body() createCommentDto: CreateCommentDto,
        @Res() response: Response
    ): Promise<Response> {
        createCommentDto.author = phone;
        return await this.commentService.createComment(
            createCommentDto,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "get all comments " })
    @ApiTags('comment')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('list')
    async getComments(
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.getComments(
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "reply to comment by comment-id " })
    @ApiTags('comment')
    @ApiBody({ type: ReplyCommentDto })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post('reply/:id')
    async replyComment(
        @GetCurrentUser("phone") phone: string,
        @Body() replyCommentDto: ReplyCommentDto,
        @Query("id") id: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.replyComment(
            phone,
            id,
            replyCommentDto,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiTags('comment')
    @ApiOperation({ summary: "edit reply comment by comment-id " })
    @ApiBody({ type: ReplyCommentDto })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch('reply/:id')
    async editReplyComment(
        @GetCurrentUser("phone") phone: string,
        @Body() replyCommentDto: ReplyCommentDto,
        @Query("id") id: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.editReplyComment(
            phone,
            id,
            replyCommentDto,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiTags('comment')
    @ApiOperation({ summary: "show comment by comment-id " })
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
    }

    @UseGuards(JwtGuard)
    @ApiTags('comment')
    @ApiOperation({ summary: "delete comment by comment-id " })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete(':id')
    async deleteComment(
        @Param("id") commentId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.deleteComment(
            commentId,
            response
        )
    }


    @UseGuards(JwtGuard)
    @ApiTags('comment')
    @ApiOperation({ summary: "get user comments by user-id " })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('user/:id')
    async getUserComments(
        @Param("id") userId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.commentService.getUserComments(
            userId,
            response
        )
    }

    @UseGuards(JwtGuard)
    @ApiTags('comment')
    @ApiOperation({ summary: "get food comments by food-id " })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiFoundResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('food/:id')
    async getFoodComments(
        @Param("id") foodId: string,
        @Res() response: Response
    ) {
        return this.commentService.getFoodComments(
            foodId,
            response
        )
    }

}

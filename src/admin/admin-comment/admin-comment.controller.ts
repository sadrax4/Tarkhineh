import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards';
import { CommentService } from 'src/comment/comment.service';
import { IsShowCommentDto } from 'src/comment/dto';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';

@Controller('admin')
export class AdminCommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
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
}

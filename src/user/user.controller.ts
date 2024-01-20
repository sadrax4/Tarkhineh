import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { Request, Response } from 'express';
import {  ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {  UnAuthorizeResponseMessage } from 'src/common/constant';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(JwtGuard)
    @ApiTags('user')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get()
    async getUser(
        @Res() response: Response,
        @Req() request: Request,
        @GetCurrentUser('phone') phone: string,
    ) {
        const projection = {
            hashRT: 0,
            otp: 0
        };
        let user: any = await this.userService.findUser(phone, projection);
        return response
            .status(HttpStatus.OK)
            .json({
                data: user,
                statusCode: HttpStatus.OK
            })
    }

    @ApiTags('user')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get("list")
    async getUserList(
        @Res() response: Response
    ) {
        const users = await this.userService.findAllUsers();
        return response
            .status(HttpStatus.OK)
            .json({
                data: users,
                statusCode: HttpStatus.OK
            })
    }

}

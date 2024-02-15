import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard, JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnAuthorizeResponseMessage } from 'src/common/constant';
import { discountCode } from 'src/common/utils';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "get all user information " })
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
        console.log(discountCode());
        return response
            .status(HttpStatus.OK)
            .json({
                data: user,
                statusCode: HttpStatus.OK
            })
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "get all users information " })
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

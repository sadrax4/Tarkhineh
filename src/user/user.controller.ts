import { Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { Response } from 'express';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';


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
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ) {
        const projection = {
            hashRT: 0,
            otp: 0
        };
        let user: any = await this.userService.findUser(phone, projection);
        return response
            .status(HttpStatus.OK)
            .json({
                data: user ,
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

import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { OkResponseMessage } from 'src/common/constant';
import { BlackListDto, FindUserDto } from './dto';
import { DeleteUserDto } from 'src/profile/dto';
import { AdminUserService } from './admin-user.service';
import { Response } from 'express';

@Controller('admin')
export class AdminUserController {
    constructor(
        private adminUserService: AdminUserService
    ) { }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "get all users" })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("users")
    async getUsers(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.getUsers(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "get user black list " })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("user/blacklist")
    async getBlacklistPhones(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.getBlacklistPhones(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "find user by query " })
    @ApiBody({ type: FindUserDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("find-user")
    async findUser(
        @Body() findUserDto: FindUserDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.findUser(
            findUserDto,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "find user by user-id " })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("find-user/:id")
    async findUserById(
        @Query("id") userId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.findUserById(
            userId,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "create user blacklist by phone " })
    @ApiBody({ type: BlackListDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("user/blacklist")
    async addPhoneToBlacklist(
        @Body() blackListDto: BlackListDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.addPhoneToBlacklist(
            blackListDto,
            response
        );
    }


    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "delete user " })
    @ApiBody({ type: DeleteUserDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete("user")
    async deleteUser(
        @Body() deleteUserDto: DeleteUserDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.deleteUser(
            deleteUserDto,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiOperation({ summary: "delete user from black list " })
    @ApiBody({ type: BlackListDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete("user/blacklist")
    async removePhoneFromBlacklist(
        @Body() blackListDto: BlackListDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminUserService.removePhoneFromBlacklist(
            blackListDto,
            response
        );
    }
}

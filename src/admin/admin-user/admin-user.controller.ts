import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { OkResponseMessage } from 'src/common/constant';
import { BlackListDto, FindUserDto } from './dto';
import { DeleteUserDto } from 'src/profile/dto';
import { AdminUserService } from './admin-user.service';
import { Response } from 'express';

@Controller('admin')
export class AdminUserController {
    constructor(
        private adminService: AdminUserService
    ) { }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("users")
    async getUsers(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.getUsers(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("user/blacklist")
    async getBlacklistPhones(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.getBlacklistPhones(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
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
        return this.adminService.findUser(
            findUserDto,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("find-user/:id")
    async findUserById(
        @Query("id") userId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.findUserById(
            userId,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
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
        return this.adminService.addPhoneToBlacklist(
            blackListDto,
            response
        );
    }


    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
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
        return this.adminService.deleteUser(
            deleteUserDto,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-user')
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
        return this.adminService.removePhoneFromBlacklist(
            blackListDto,
            response
        );
    }


}

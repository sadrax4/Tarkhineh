import { Body, Controller, Delete, Get, HttpStatus, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { StringToArray } from 'src/common/decorators';
import { UploadMultiFilesAws } from 'src/common/interceptors';
import { MulterFile } from 'src/common/types';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { BlackListDto, FindUserDto } from './dto';
import { DeleteUserDto } from 'src/profile/dto';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
    @ApiTags('admin-user')
    @ApiBody({ type: FindUserDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("find-user")
    async findUser(
        @Body() findUserDto: FindUserDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.findUser(
            findUserDto,
            response
        );
    }

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
    @ApiTags('admin-user')
    @ApiBody({ type: BlackListDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("user/blacklist")
    async blackListPhone(
        @Body() blackListDto: BlackListDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.blackListPhone(
            blackListDto,
            response
        );
    }
}

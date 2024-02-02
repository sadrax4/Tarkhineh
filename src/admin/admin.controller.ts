import { Body, Controller, Get, HttpStatus, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { StringToArray } from 'src/common/decorators';
import { UploadMultiFilesAws } from 'src/common/interceptors';
import { MulterFile } from 'src/common/types';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @UseGuards(JwtGuard)
    @ApiTags('admin')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("users")
    async createFood(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminService.getUsers(
            response
        );
    }
}

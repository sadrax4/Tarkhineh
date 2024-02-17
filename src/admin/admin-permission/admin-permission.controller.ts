import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { OkResponseMessage } from '@app/common';
import { AdminPermissionService } from './admin-permission.service';
import { GiveAccessDto } from './dto/giveAccess.dto';
import { Response } from 'express';

@Controller('admin/permission')
export class AdminPermissionController {
    constructor(
        private adminPermissionService: AdminPermissionService
    ) { }

    @UseGuards(AdminGuard)
    @ApiTags('admin-permission')
    @ApiOperation({ summary: "give admin permission by phone" })
    @ApiBody({
        type: GiveAccessDto
    })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("admin-access")
    async giveAdminAccess(
        @Res() response: Response,
        @Body() giveAccessDto: GiveAccessDto
    ): Promise<Response> {
        return this.adminPermissionService.giveAdminAccess(
            giveAccessDto,
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-permission')
    @ApiOperation({ summary: "give user permission by phone" })
    @ApiBody({
        type: GiveAccessDto
    })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("user-access")
    async giveUserAccess(
        @Res() response: Response,
        @Body() giveAccessDto: GiveAccessDto
    ): Promise<Response> {
        return this.adminPermissionService.giveUserAccess(
            giveAccessDto,
            response
        )
    }
}

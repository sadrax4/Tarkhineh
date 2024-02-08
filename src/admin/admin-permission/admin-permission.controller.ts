import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { OkResponseMessage } from 'src/common/constant';

@Controller('admin')
export class AdminPermissionController {

    @UseGuards(AdminGuard)
    @ApiTags('admin-permission')
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
}

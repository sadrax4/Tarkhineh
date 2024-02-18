import { OkResponseMessage, UnAuthorizeResponseMessage } from '@app/common';
import { Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { AdminOrderService } from './admin-order.service';
import { Response } from 'express';

@Controller('admin')
export class AdminOrderController {
    constructor(
        private adminOrderService: AdminOrderService
    ) { }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "get all orders " })
    @ApiTags('admin-order')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Get("order")
    async getOrders(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminOrderService.getOrders(
            response
        )
    }


}

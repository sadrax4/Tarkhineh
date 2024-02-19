import { OkResponseMessage, UnAuthorizeResponseMessage } from '@app/common';
import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { AdminOrderService } from './admin-order.service';
import { Response } from 'express';
import { OrderStatusDto } from './dto';

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
        status: HttpStatus.OK
    })
    @Get("order")
    async getOrders(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminOrderService.getOrders(
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "set order status " })
    @ApiTags('admin-order')
    @ApiBody({ type: OrderStatusDto })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("order")
    async setOrderStatus(
        @Body() orderStatusDto: OrderStatusDto
        @Query("id") orderId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.adminOrderService.setOrderStatus(
            orderId,
            orderStatusDto
            response
        )
    }

}

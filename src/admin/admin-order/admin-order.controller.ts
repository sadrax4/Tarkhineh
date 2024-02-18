import { MIMETYPE, OkResponseMessage, UnAuthorizeResponseMessage } from '@app/common';
import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards';
import { AdminOrderService } from './admin-order.service';

@Controller('admin')
export class AdminOrderController {
    constructor(
        private adminOrderService: AdminOrderService
    ) { }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "get all orders" })
    @ApiBody({ type: GenerateDiscountCodeDto })
    @ApiTags('admin-order')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post("order")
    async getOrders(
        @Body() generateDicountCodeDto: GenerateDiscountCodeDto,
        @Res() response: Response,
    ) {
        return this.adminOrderService.getOrders(
            generateDicountCodeDto,
            response
        )
    }


}

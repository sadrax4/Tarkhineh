import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { GetCurrentUser } from 'src/common/decorators';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { RedeemDiscountCodeDto } from './dto';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "payment gateway " })
    @ApiTags('payment')
    @ApiBody({ type: RedeemDiscountCodeDto, required: false })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("gateway")
    async paymentGatewat(
        @Body() redeemDiscountCodeDto: RedeemDiscountCodeDto,
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.paymentService.paymentGateway(
            phone,
            redeemDiscountCodeDto.discountCode,
            response
        )
    }


}

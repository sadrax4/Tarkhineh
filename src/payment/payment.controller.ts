import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { OkResponseMessage, GetCurrentUser } from '@app/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { RedeemDiscountCodeDto } from './dto';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "payment gateway "})
    @ApiTags('payment')
    @ApiBody({ type: RedeemDiscountCodeDto, required: false })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post("gateway")
    async paymentGatewat(
        @Body() paymentGatewayDto: PaymentGatewayDto,
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.paymentService.paymentGateway(
            phone,
            redeemDiscountCodeDto.discountCode,
            response
        )
    }

    @ApiOperation({ summary: "payment verify " })
    @ApiTags('payment')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("verify")
    async paymentVerify(
        @Query("Authority") authority: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.paymentService.paymentVerify(
            authority,
            response
        )
    }
}

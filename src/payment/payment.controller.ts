import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { OkResponseMessage, GetCurrentUser } from '@app/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { PaymentGatewayDto } from './dto';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "payment gateway " })
    @ApiTags('payment')
    @ApiBody({ type: PaymentGatewayDto, required: false })
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
            paymentGatewayDto,
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
        @Query("trackId") authority: string,
        @Res() response: Response
    ): Promise<void> {
        return this.paymentService.paymentVerify(
            authority,
            response
        )
    }
}

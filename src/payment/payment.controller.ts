import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { OkResponseMessage } from 'src/common/constant';
import { GetCurrentUser } from 'src/common/decorators';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "payment gateway " })
    @ApiTags('payment')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("gateway")
    async paymentGatewat(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.paymentService.paymentGateway(
            phone,
            response
        )
    }
}

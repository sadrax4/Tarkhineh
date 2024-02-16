import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ZarinPallResponse } from 'src/common/types';
import { generateInvoiceNumber } from 'src/auth/utils';
import { getPersianDate } from 'src/common/utils';

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }

    async paymentGateway(
        phone: string,
        response: Response
    ) {
        try {
            const user = await this.userService.findUser(phone);
            const amount: number = user?.carts.totalPayment;
            const description = "درگاه خرید ترخینه";
            const ZARINPALL_OPTION = {
                merchant_id: this.configService.get<string>("ZARINPALL_MERCHENT_ID"),
                currency: "IRR",
                amount,
                description,
                callback_url: "http://localhost:3000/payment/verify",
                metadata: {
                    email: user?.email,
                    mobile: phone
                }
            }
            const requestResult: ZarinPallResponse = await axios.post(
                this.configService.get<string>("ZARINPALL_REQUEST_URL"),
                ZARINPALL_OPTION
            ).then(result => result.data)
            const { authority, code } = requestResult.data;
            const invoiceNumber = generateInvoiceNumber();
            const paymentDate = getPersianDate();
            console.log(paymentDate, invoiceNumber)
            return response
                .status(HttpStatus.OK)
                .json({
                    requestResult,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

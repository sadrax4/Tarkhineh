import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { INTERNAL_SERVER_ERROR_MESSAGE, generateInvoiceNumber } from '@app/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ZarinPallResponse } from '@app/common';
import { calculatePrice, getPersianDate } from '@app/common';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto';
import { AdminDiscountCodeService } from 'src/admin';

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly discountCodeService: AdminDiscountCodeService
    ) { }

    async paymentGateway(
        phone: string,
        dicountCode: string = null,
        response: Response
    ) {
        try {
            const user = await this.userService.findUser(phone);
            let amount: number;
            if (dicountCode) {
                const discountPercentage = await this.discountCodeService.redeemDicountCode(
                    dicountCode
                );
                amount = calculatePrice(
                    user.carts.totalPayment,
                    discountPercentage
                );
            } else {
                amount = user.carts.totalPayment
            }
            user?.carts.totalPayment
            const description = "درگاه خرید ترخینه";
            const ZARINPALL_OPTION = {
                merchant_id: this.configService.get<string>("ZARINPALL_MERCHENT_ID"),
                currency: "IRR",
                amount: 10000,
                description,
                callback_url: this.configService.get<string>("PRODUCTION_PAYMENT_CALLBACK_URL"),
                metadata: {
                    email: user?.email,
                    mobile: phone
                }
            }
            const requestResult: ZarinPallResponse = await axios.post(
                this.configService.get<string>("ZARINPALL_REQUEST_URL"),
                ZARINPALL_OPTION
            ).then(result => result.data)
            const { authority, code } = requestResult?.data;
            const invoiceNumber = generateInvoiceNumber();
            const paymentDate = getPersianDate();
            const orderData: CreateOrderDto = {
                userPhone: phone,
                userId: user._id,
                invoiceNumber,
                totalPayment: amount,
                verify: false,
                paymentDate,
                authority,
                description,
                carts: user.carts
            }
            await this.orderService.createOrder(
                orderData
            )
            if (code == 100 && authority) {
                const gatewayURL = `${this.configService.get<string>("ZARINPALL_GATEWAT")}/${authority}`;
                return response.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    gatewayURL
                });
            }
            throw new HttpException(
                "مقادیر ارسال شده صحیح نمیباشد",
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async paymentVerify(
        authority: string,
        response: Response
    ) {
        try {
            const payment = await this.orderService.findByAuthority(
                authority
            )
            const verifyBody = JSON.stringify({
                merchant_id: this.configService.get<string>("ZARINPALL_MERCHENT_ID"),
                amount: payment.totalPayment,
                authority
            })

        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

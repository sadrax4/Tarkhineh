import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { } from '@app/common';
import { calculatePrice, getPersianDate, ZarinPallResponse, INTERNAL_SERVER_ERROR_MESSAGE, generateInvoiceNumber } from '@app/common';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto';
import { AdminDiscountCodeService } from 'src/admin';
import { PaymentGatewayDto } from './dto';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
        {
            addressId,
            discountCode
        }: PaymentGatewayDto,
        response: Response
    ): Promise<Response> {
        try {
            const user = await this.userService.findUser(phone);
            let amount: number;
            if (discountCode) {
                const discountPercentage = await this.discountCodeService.redeemDiscountCode(
                    discountCode
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
                callback_url: this.configService.get<string>("DEVELOPMENT_PAYMENT_CALLBACK_URL"),
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
                addressId,
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
    ): Promise<Response> {
        try {
            const payment = await this.orderService.findByAuthority(
                authority
            )
            console.log("payment", payment)
            const verifyBody = JSON.stringify({
                merchant_id: this.configService.get<string>("ZARINPALL_MERCHENT_ID"),
                amount: 10000,//payment.totalPayment,
                authority
            })
            const verifyResult: any = await fetch(process.env.ZARINPALL_VERIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: verifyBody
            }).then(result => result.json());
            if (verifyResult.data.code == Number(101)) {
                const refId = verifyResult.data.ref_id;
                const cardPan = verifyResult.data.card_pan;
                const cardHash = verifyResult.data.card_hash;
                await Promise.all([
                    this.orderService.updatePayment(
                        authority,
                        refId,
                        cardPan,
                        cardHash
                    ),
                    this.userService.deleteCarts(
                        payment.userPhone
                    )
                ])
                return response
                    .status(HttpStatus.OK)
                    .json({
                        statusCode: HttpStatus.OK,
                        message: "برداخت با موفقیت انجام شد"
                    })
            } else {
                throw new HttpException(
                    "برداخت ناموفق.در صورت کسر وجه طی ۲۴ ساعت برگشت میخورد",
                    HttpStatus.BAD_GATEWAY
                )
            }
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

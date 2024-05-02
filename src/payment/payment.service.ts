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
            if (!user.carts) {
                throw new HttpException(
                    "سبد خرید شما خالی میباشد",
                    HttpStatus.BAD_REQUEST
                )
            }
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
            const description = "درگاه خرید ترخینه";
            const ZARINPALL_OPTION = {
                merchant: "zibal",
                amount,
                description,
                callbackUrl: this.configService.get<string>("DEVELOPMENT_PAYMENT_CALLBACK_URL"),
            }
            const requestResult = await axios.post(
                this.configService.get<string>("ZARINPALL_REQUEST_URL"),
                ZARINPALL_OPTION
            ).then(result => result.data)
            const { trackId, result } = requestResult;
            const invoiceNumber = generateInvoiceNumber();
            const paymentDate = getPersianDate();
            const orderData: CreateOrderDto = {
                userPhone: phone,
                userId: user._id,
                invoiceNumber,
                totalPayment: amount,
                verify: false,
                paymentDate,
                authority: trackId,
                description,
                addressId,
                carts: user.carts
            }
            await this.orderService.createOrder(
                orderData
            )
            if (result == 100 && trackId) {
                const gatewayURL = `${this.configService.get<string>("ZARINPALL_GATEWAY")}/${trackId}`;
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
                (error),
                HttpStatus.INTERNAL_SERVER_ERROR
            );

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
            const verifyBody = JSON.stringify({
                merchant: "zibal",
                trackId: authority
            })
            const verifyResult: any = await fetch(process.env.ZARINPALL_VERIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: verifyBody
            }).then(result => result.json());
            if (verifyResult.result == Number(100)) {
                const refId = 'ss';
                const cardPan = 'ss';
                const cardHash = 'ss';
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
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

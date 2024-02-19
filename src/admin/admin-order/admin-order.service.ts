import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from 'src/order/order.service';
import { OrderStatusDto } from './dto';

@Injectable()
export class AdminOrderService {
    constructor(
        private orderService: OrderService
    ) { }

    async getOrders(
        response: Response
    ): Promise<Response> {
        const orders = await this.orderService.getOrders();
        return response
            .status(HttpStatus.OK)
            .json({
                orders,
                statusCode: HttpStatus.OK
            })
    }

    async setOrderStatus(
        orderId: string,
        { status }: OrderStatusDto,
        response: Response
    ): Promise<Response> {
        await this.orderService.setOrderStatus(
            orderId,
            status
        );
        return response
            .status(HttpStatus.OK)
            .json({
                message: "وضعیت سفارش با موفقیت ثبت شد",
                statusCode: HttpStatus.OK
            })
    }
}

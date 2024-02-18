import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from 'src/order/order.service';

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
}

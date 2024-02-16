import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from './db/order.repository';
import { CreateOrderDto } from './dto/createOrder';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { Types } from 'mongoose';

@Injectable()
export class OrderService {
    constructor(
        private orderRepository: OrderRepository
    ) { }

    async createOrder(
        createOrderDto: CreateOrderDto
    ): Promise<void> {
        const orderData = {
            ...createOrderDto,
            _id: new Types.ObjectId()
        }
        try {
            await this.orderRepository.create(orderData)
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

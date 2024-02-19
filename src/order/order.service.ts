import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from './db/order.repository';
import { CreateOrderDto } from './dto/createOrder';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';
import { Types } from 'mongoose';
import { Order } from './db/order.schema';

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

    async getOrders(
    ): Promise<Order[]> {
        try {
            return await this.orderRepository.find({});
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findByAuthority(
        authority: string
    ): Promise<Order> {
        try {
            const payment = await this.orderRepository.findOne({ authority })
            if (!payment) {
                throw new HttpException(
                    "تراکنشی در انتظار برداخت یافت نشد",
                    HttpStatus.NOT_FOUND
                )
            }
            if (payment.verify) {
                throw new HttpException(
                    "تراکنش قبلا برداخت شده است",
                    HttpStatus.NOT_FOUND
                )
            }
            return payment;
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updatePayment(
        authority: string,
        refId: string,
        cardPan: string,
        cardHash: string
    ): Promise<void> {
        try {
            await this.orderRepository.findOneAndUpdate(
                { authority },
                {
                    $set: {
                        refId,
                        cardPan,
                        cardHash,
                        verify: true
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getUserOrders(
        userPhone: string
    ): Promise<Order[]> {
        try {
            return await this.orderRepository.find(
                {
                    userPhone
                },
                {
                    userId: 0,
                    authority: 0,
                    createdAt: 0,
                    updatedAt: 0
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async setOrderStatus(
        orderId: string,
        status: string
    ): Promise<void> {
        try {
            await this.orderRepository.findOneAndUpdate(
                {
                    _id: new Types.ObjectId(orderId)
                },
                {
                    $set: {
                        status
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async cancelOrder(
        orderId: string
    ): Promise<void> {
        try {
            await this.orderRepository.findOneAndUpdate(
                {
                    _id: new Types.ObjectId(orderId)
                },
                {
                    $set: {
                        status: "لغو شده"
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

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

    async getOrders(
    ): Promise<Order[]> {
        try {
            return await this.orderRepository.find({});
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

    async findByAuthority(
        authority: string
    ): Promise<Order> {
        try {
            console.log(authority)
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

    async updatePayment(
        authority: string,
        refId: string,
        cardPan: string,
        cardHash: string
    ): Promise<void> {
        try {
            console.log('trtret')
            const result = await this.orderRepository.findOneAndUpdate(
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
            console.log(result)
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

    async getUserOrders(
        userPhone: string,
        filterQuery: string = null
    ): Promise<Order[]> {
        try {
            return await this.orderRepository.aggregate([
                {
                    $match: {
                        userPhone,
                        verify: true,
                        status: filterQuery
                    }
                },
                {
                    $lookup: {
                        from: 'foods',
                        as: 'carts.foodDetail.data',
                        foreignField: '_id',
                        localField: 'carts.foodDetail.foodId'
                    }
                },
                {
                    $project: {
                        userId: 0,
                        authority: 0,
                        createdAt: 0,
                        updatedAt: 0
                    }
                }
            ]
            )
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

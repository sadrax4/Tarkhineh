import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from './db/order.repository';
import { CreateOrderDto } from './dto/createOrder';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';
import mongoose, { Types } from 'mongoose';
import { Order } from './db/order.schema';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
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
    ): Promise<any> {
        try {
            let userOrderData;
            if (filterQuery == "جاری") {
                userOrderData = {
                    userPhone,
                    verify: true
                }
            } else if (filterQuery == "لغو شده") {
                userOrderData = {
                    userPhone,
                    verify: false
                }
            } else if (filterQuery == "" || !filterQuery) {
                userOrderData = {
                    userPhone
                }
            } else if (filterQuery == "تحویل شده") {
                return [];
            }
            let userOrder: any = await this.orderRepository.find(
                userOrderData,
                {
                    authority: 0
                }
            )
            let orderData = userOrder;
            let orders: any = await this.orderRepository.aggregate([
                {
                    $match: userOrderData
                },
                {
                    $project: {
                        "carts.foodDetail.foodId": 1,
                        "carts.foodDetail.totalQuantity": "$carts.foodDetail.quantity",
                        "_id": false
                    }
                },
                {
                    $lookup: {
                        from: 'foods',
                        as: 'carts.order',
                        foreignField: '_id',
                        localField: 'carts.foodDetail.foodId',
                    }
                },
                {
                    $project: {
                        order: {
                            $map: {
                                input: { $range: [0, { $size: "$carts.foodDetail" }] },
                                in: {
                                    $mergeObjects: [
                                        { $arrayElemAt: ["$carts.foodDetail", "$$this"] },
                                        { $arrayElemAt: ["$carts.order", "$$this"] }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        "order.comments": 0,
                        "order._id": 0
                    }
                }
            ])
            const userAddress = await this.userService.findUser(
                userPhone,
                {
                    address: true
                }
            )
            orderData.forEach(
                order => {
                    orders.forEach(
                        userOrder => {
                            userAddress.address.forEach(
                                address => {
                                    console.log(address._id == new ObjectId(order.addressId))
                                    if (address._id.toHexString() == order.addressId) {
                                        console.log(order, "ss")
                                        order.addressId = address;
                                    }
                                }
                            )
                            order.carts = userOrder
                        }
                    )
                }
            )
            return orderData;
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

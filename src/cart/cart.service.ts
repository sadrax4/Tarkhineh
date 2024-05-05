import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { FoodService } from 'src/food/food.service';
import { AuthService } from 'src/auth/auth.service';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { DecrementFood, IncrementFood } from './dto';
import { AccessCookieConfig, generateFakePhone } from '@app/common';
import { calculatePrice } from '@app/common';
import { AdminDiscountCodeService } from 'src/admin';
import { RedeemDiscountCodeDto } from 'src/payment/dto';
import { unsubscribe } from 'diagnostics_channel';
import { ObjectId } from 'mongodb';

@Injectable()
export class CartService {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly adminDiscountCodeService: AdminDiscountCodeService,
        private readonly foodService: FoodService
    ) { }

    async addToCart(
        createCartDto: CreateCartDto,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            let userPhone: string;
            if (!phone) {
                const {
                    fakePhone,
                    accessToken
                } = await this.createUnknowUser();
                userPhone = fakePhone;
                response.cookie(
                    'access-token',
                    accessToken,
                    AccessCookieConfig
                )
            } else {
                userPhone = phone;
            }
            const [foodPrice] = await Promise.all([
                this.foodService.getPrice(
                    createCartDto.foodId
                ),
                this.foodService.checkFoodQuantity(
                    createCartDto.foodId
                )
            ])
            await this.userService.addToCart(
                userPhone,
                createCartDto.foodId,
                foodPrice,
            );
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "غذا با موفقیت به سبد خرید اضافه شد",
                    statusCode: HttpStatus.OK
                })
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

    async removeFromCart(
        removeCartDto: RemoveCartDto,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const foodPrice = await this.foodService.getPrice(
                removeCartDto.foodId
            )
            await this.userService.removeFromCart(
                phone,
                removeCartDto.foodId,
                foodPrice
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "غذا با موفقیت از سبد خرید حذف شد",
                    statusCode: HttpStatus.OK
                })
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

    async getCarts(
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            let carts = await this.userService.getCarts(
                phone
            )
            let totalDiscount: number = 0;
            let totalPayment = carts?.totalPayment;
            carts?.foodDetails?.forEach(
                (food: any) => {
                    for (let index = 0; index < carts?.foodDetail?.length; index++) {
                        if (food._id == carts?.foodDetail[index].foodId.toString()) {
                            carts.foodDetail[index].foodDetail = food
                        }
                    }
                }
            )
            carts?.foodDetail?.forEach(
                (food: any) => {
                    if (food.foodDetail.discount > 0) {
                        food.foodDetail.newPrice = calculatePrice(
                            food.foodDetail.price,
                            food.foodDetail.discount
                        );
                        totalDiscount += (food.foodDetail.price - food.foodDetail.newPrice) * food.quantity;
                    }
                    delete food?.foodId;
                }
            )
            // if (discountCode) {
            //     const percentage = await this.adminDiscountCodeService.checkDiscountCode(
            //         discountCode
            //     )
            //     totalDiscount += (totalPayment - (calculatePrice(totalPayment, percentage)));
            //     totalPayment = calculatePrice(totalPayment, percentage);
            // }
            const data = carts?.foodDetail;
            const detail = {
                totalPrice: totalPayment,
                totalDiscount,
                cardQunatity: carts?.foodDetail?.length
            }
            return response
                .status(HttpStatus.OK)
                .json({
                    data,
                    detail,
                    statusCode: HttpStatus.OK
                })
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

    async redeemDiscountCode(
        phone: string,
        { discountCode }: RedeemDiscountCodeDto,
        response: Response
    ): Promise<Response> {
        try {
            let carts = await this.userService.getCarts(
                phone
            )
            let totalPercent: number = 0;
            let percentage: number = 0;
            let totalPayment = carts?.totalPayment;
            carts?.foodDetails?.forEach(
                (food: any) => {
                    for (let index = 0; index < carts?.foodDetail?.length; index++) {
                        if (food._id == carts?.foodDetail[index].foodId.toString()) {
                            carts.foodDetail[index].foodDetail = food
                        }
                    }
                }
            )
            carts?.foodDetail?.forEach(
                (food: any) => {
                    if (food.foodDetail.discount > 0) {
                        food.foodDetail.newPrice = calculatePrice(
                            food.foodDetail.price,
                            food.foodDetail.discount
                        );
                        totalPercent += food.foodDetail.discount;
                        percentage += (food.foodDetail.price - food.foodDetail.newPrice) * food.quantity;
                    }
                    delete food?.foodId;
                }
            )
            let detail = {
                totalPrice: totalPayment,
                totalDiscount: percentage,
                discountCodeStatus: undefined,
                lastPrice: undefined,
                totalPercent,
            }
            if (discountCode) {
                const discountPercentage = await this.adminDiscountCodeService.returnDiscountCodeStatus(
                    discountCode
                )
                if (!discountPercentage) {
                    detail.discountCodeStatus = false;
                } else {
                    detail.discountCodeStatus = true;
                    detail.totalPercent += discountPercentage;
                    detail.totalDiscount += (totalPayment - (calculatePrice(totalPayment, discountPercentage)));
                    detail.totalPrice = calculatePrice(totalPayment, discountPercentage);
                }
            }
            detail.lastPrice = (+detail.totalPrice) + (+detail.totalDiscount);
            return response
                .status(HttpStatus.OK)
                .json({
                    detail,
                    statusCode: HttpStatus.OK
                })
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

    async getCountOfCart(
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const numberOfCart = await this.userService.getCountOfCart(
                phone
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    numberOfCart,
                    statusCode: HttpStatus.OK
                })
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

    async incrementFood(
        incrementFood: IncrementFood,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const user = await this.userService.findUser(phone);
            const userFoodQuantity = user.carts.foodDetail.map(
                food => {
                    if (String(food.foodId) == incrementFood.foodId) {
                        console.log('x')
                        return food.quantity
                    }
                }
            ).filter(
                item => {
                    return typeof item == 'number';
                }
            )
            console.log(userFoodQuantity);

            const [foodPrice] = await Promise.all([
                this.foodService.getPrice(
                    incrementFood.foodId
                ),
                this.foodService.checkFoodQuantity(
                    incrementFood.foodId,
                    userFoodQuantity[0]
                )
            ])
            await this.userService.incrementFood(
                phone,
                incrementFood.foodId,
                foodPrice
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "تعداد غذا با موفقیت افزایش یافت",
                    statusCode: HttpStatus.OK
                })
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

    async decrementFood(
        decrementFood: DecrementFood,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const foodPrice = await this.foodService.getPrice(
                decrementFood.foodId
            )
            await this.userService.decrementFood(
                phone,
                decrementFood.foodId,
                foodPrice
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "تعداد غذا با موفقیت کاهش یافت",
                    statusCode: HttpStatus.OK
                })
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

    async deleteCarts(
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.deleteCarts(
                phone,
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "سبد خرید شما با موفقیت حذف شد",
                    statusCode: HttpStatus.OK
                })
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

    private async createUnknowUser()
        : Promise<{ fakePhone: string, accessToken: string }> {
        try {
            const userPhone = generateFakePhone()
            await this.userService.createUser({
                phone: userPhone
            });
            const { _id } = await this.userService.findUser(
                userPhone
            );
            const accessToken = await this.authService.getAccessToken(
                userPhone,
                _id.toString()
            )
            return {
                fakePhone: userPhone,
                accessToken
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

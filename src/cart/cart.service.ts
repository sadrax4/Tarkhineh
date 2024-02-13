import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { generateFakePhone } from 'src/common/utils/generate-fake-phone';
import { FoodService } from 'src/food/food.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CartService {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly foodService: FoodService
    ) { }
    async addToCart(
        createCartDto: CreateCartDto,
        phone: string,
        response: Response
    ): Promise<Response> {
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
                {
                    sameSite: 'none',
                    httpOnly: false,
                    secure: true,
                    maxAge: (1 * 3600 * 1000),
                }
            )
        } else {
            userPhone = phone;
        }
        const foodPrice = await this.foodService.getPrice(
            createCartDto.foodId
        );
        await this.foodService.checkFoodQuantity(
            createCartDto.foodId
        )
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
    }

    private async createUnknowUser(
    ) {
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
    }
}

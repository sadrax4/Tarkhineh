import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UnAuthorizeResponseMessage } from 'src/common/constant';
import { PublicGuard } from 'src/auth/guards';
import { ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) { }

    @UseGuards(PublicGuard)
    @ApiOperation({ summary: "add food to cart" })
    @ApiTags('cart')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Post("add")
    async addToCart(
        @Res() response: Response,
        @Req() request: Request,
    ) {
        const projection = {
            hashRT: 0,
            otp: 0
        };
        let user: any = await this.userService.findUser(phone, projection);
        return response
            .status(HttpStatus.OK)
            .json({
                data: user,
                statusCode: HttpStatus.OK
            })
    }
}

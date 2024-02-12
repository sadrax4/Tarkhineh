import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UnAuthorizeResponseMessage } from 'src/common/constant';
import { PublicGuard } from 'src/auth/guards';
import { ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateCartDto } from './dto';
import { GetCurrentUser } from 'src/common/decorators';
import { Response } from 'express';

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
        @Body() createCartDto: CreateCartDto,
        @Res() response: Response,
        @GetCurrentUser("phone") phone: string = null
    ) {
        return this.cartService.addToCart(
            createCartDto,
            phone,
            response
        )
    }
}

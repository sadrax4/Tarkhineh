import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
    constructor(
        private readonly userService: UserService
    ) { }
    async addToCart(
        createCartDto: CreateCartDto,
        phone: string,
        response: Response
    ) {
        if (!phone) {
            this.userService
        }
    }
}

import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Response } from 'express';

@Injectable()
export class CartService {

    async addToCart(
        createCartDto: CreateCartDto,
        phone: string,
        response: Response
    ) {
        if (!phone) {
            
        }
    }
}

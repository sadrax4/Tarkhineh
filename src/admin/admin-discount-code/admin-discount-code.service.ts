import { Injectable } from '@nestjs/common';
import { GenerateDiscountCode } from './dto';
import { Response } from 'express';

@Injectable()
export class AdminDiscountCodeService {
    async generate(
        generateDicountCode: GenerateDiscountCode,
        response: Response
    ){
        
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateDiscountCodeDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue, dicountCodeGenerator } from 'src/common/utils';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { DiscountCodeRepository } from './db/discount-code.repository';
import { Types } from 'mongoose';

@Injectable()
export class AdminDiscountCodeService {
    constructor(
        private dicountCodeRepository: DiscountCodeRepository
    ) { }
    async generate(
        generateDicountCodeDto: GenerateDiscountCodeDto,
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(generateDicountCodeDto);
        try {
            const dicountCodeData = {
                ...generateDicountCodeDto,
                _id: new Types.ObjectId(),
                value: dicountCodeGenerator()
            }
            await this.dicountCodeRepository.create(dicountCodeData)
            return response
                .status(HttpStatus.CREATED)
                .json({
                    discountCode: dicountCodeData.value,
                    statusCode: HttpStatus.CREATED
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getDiscountCodes(
        response: Response
    ): Promise<Response> {
        try {
            const dicountCodes = await this.dicountCodeRepository.find({});
            return response
                .status(HttpStatus.OK)
                .json({
                    dicountCodes,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

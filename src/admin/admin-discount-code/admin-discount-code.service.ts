import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateDiscountCodeDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue, dicountCodeGenerator } from '@app/common';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';
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

    async deleteDiscountCode(
        discountCodeId: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.dicountCodeRepository.deleteOne({
                _id: new Types.ObjectId(discountCodeId)
            })
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "کد تخفیف با موفقیت حذف شد",
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
        discountCode: string
    ): Promise<number> {
        try {
            const code = await this.dicountCodeRepository.findOne({
                value: discountCode
            })
            if (!code) {
                throw new HttpException(
                    (INTERNAL_SERVER_ERROR_MESSAGE + " کد اشتباه است "),
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            if (code?.isLimit == true && code?.maxUses == 0) {
                return null;
            }
            await this.dicountCodeRepository.findOneAndUpdate(
                { value: discountCode },
                {
                    $inc: {
                        maxUses: -1
                    }
                }
            )
            return code.percentage;
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

    async checkDiscountCode(
        discountCode: string
    ): Promise<number> {
        const code = await this.dicountCodeRepository.findOne({
            value: discountCode
        })
        if (!code) {
            throw new HttpException(
                (" کد اشتباه است "),
                HttpStatus.BAD_REQUEST
            )
        }
        if (code?.isLimit == true && code?.maxUses == 0) {
            throw new HttpException(
                ("تعداد استفاده از کد به اتمام رسیده است "),
                HttpStatus.BAD_REQUEST
            )
        }
        // const date = new Date();
        // if (code.expireAt < date) {
        //     throw new HttpException(
        //         (" کد منقضی شده است "),
        //         HttpStatus.BAD_REQUEST
        //     )
        // }
        return code.percentage;
    }
}

import { ApiProperty } from "@nestjs/swagger";

export class GenerateDiscountCodeDto {

    @ApiProperty()
    amount: number;

    @ApiProperty()
    maxUses?: number;

    @ApiProperty()
    isLimit: boolean;

    @ApiProperty()
    expireAt: Date;

}
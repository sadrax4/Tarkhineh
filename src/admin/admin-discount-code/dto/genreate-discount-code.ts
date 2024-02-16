import { ApiProperty } from "@nestjs/swagger";

export class GenerateDiscountCodeDto {

    @ApiProperty()
    percentage: number;

    @ApiProperty()
    maxUses?: number;

    @ApiProperty()
    isLimit: boolean;

    @ApiProperty()
    expireAt: Date;

}
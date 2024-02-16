import { ApiProperty } from "@nestjs/swagger";

export class GenerateDiscountCode {

    @ApiProperty()
    amount: number;

    @ApiProperty()
    maxUses?: number;

    @ApiProperty()
    isLimit: boolean;

    @ApiProperty()
    expireAt: Date;

}
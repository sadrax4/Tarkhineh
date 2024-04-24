import { ApiProperty } from "@nestjs/swagger";

export class RedeemDiscountCodeDto {
    @ApiProperty()
    discountCode: number;
}
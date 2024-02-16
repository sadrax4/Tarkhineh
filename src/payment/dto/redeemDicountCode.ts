import { ApiProperty } from "@nestjs/swagger";

export class RedeemDiscountCodeDto {
    @ApiProperty({ required: false })
    discountCode?: string
}
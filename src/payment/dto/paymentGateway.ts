import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class RedeemDiscountCodeDto {
    @ApiProperty({ required: false })
    discountCode?: string

    @ApiProperty({ required: false })
    addressId: mongoose.Types.ObjectId
}
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class PaymentGatewayDto {
    @ApiProperty({ required: false })
    discountCode?: string

    @ApiProperty({ required: false })
    addressId: mongoose.Types.ObjectId
}
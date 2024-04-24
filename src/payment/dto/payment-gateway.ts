import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class PaymentGatewayDto {
    @ApiProperty({ required: false })
    discountCode?: string

    @ApiProperty({ required: true })
    addressId: mongoose.Types.ObjectId
}
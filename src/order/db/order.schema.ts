import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose from "mongoose";

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'order',
    virtuals: true,
})
export class Order extends AbstractDocument {

    @Prop({ required: true })
    userPhone: string;

    @Prop({ required: true })
    totalPayment: number

    @Prop()
    description: string

    @Prop({ required: true })
    invoiceNumber: number

    @Prop({ required: true })
    userId: mongoose.Types.ObjectId

    @Prop({ required: true })
    authority: string

    @Prop({ required: true })
    verify: boolean

    @Prop({ required: true })
    paymentDate: string

    @Prop({ required: true })
    carts: object

}
export const OrderSchema = SchemaFactory.createForClass(Order)



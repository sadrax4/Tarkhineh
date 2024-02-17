import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";

@Schema({ versionKey: false, collection: 'discount-code' })
export class DiscountCode extends AbstractDocument {

    @Prop({ unique: true, required: true })
    value: string;

    @Prop({ default: Date.now })
    createdAt: number;

    @Prop({ min: 1, max: 100, required: true })
    percentage: number;

    @Prop()
    maxUses: number;

    @Prop({ defaul: false })
    isLimit: boolean;

    @Prop()
    expireAt: Date;
}

export const DiscountCodeSchema = SchemaFactory.createForClass(DiscountCode);
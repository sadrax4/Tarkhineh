import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { AbstractDocument } from "@app/common";
import mongoose from "mongoose";

@Schema({ collection: 'foods', versionKey: false })
export class Food extends AbstractDocument {

    @Prop({ index: true, text: true })
    title: string;

    @Prop()
    ingredients: string[];

    @Prop({ index: true, text: true })
    description: string;

    @Prop()
    price: number;

    @Prop({ max: 100, min: 0, default: 0 })
    discount: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop()
    category: string[];

    @Prop()
    subCategory: string[];

    @Prop()
    images: string[];

    @Prop({ type: [mongoose.Types.ObjectId] })
    comments: [mongoose.Types.ObjectId]

    @Prop()
    imagesUrl: string[]

    @Prop({ default: 5, min: 1, max: 5 })
    rate: number

    @Prop({ default: 0 })
    rateCount: number
}

export const FoodSchema = SchemaFactory.createForClass(Food);
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { AbstractDocument } from "libs/database";
import mongoose from "mongoose";

@Schema({ collection: 'foods', versionKey: false })
export class Food extends AbstractDocument {

    @Prop()
    title: string;

    @Prop([String])
    ingredients: string[];

    @Prop()
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
}

export const FoodSchema = SchemaFactory.createForClass(Food);
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

    @Prop({ type: [mongoose.Types.ObjectId] })
    mainCategory: [mongoose.Types.ObjectId]

    @Prop({ type: [mongoose.Types.ObjectId] })
    subCategory: [mongoose.Types.ObjectId]

    @Prop()
    images: string[];
}

export const FoodSchema = SchemaFactory.createForClass(Food);
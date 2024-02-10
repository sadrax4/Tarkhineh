import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose, { now } from "mongoose";

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'cart',
    virtuals: true,
})
export class Cart extends AbstractDocument {

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    username: string;

    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop()
    family: string;

    @Prop()
    birthday: string;

    @Prop()
    image: string;

    @Prop({ type: [mongoose.Types.ObjectId] })
    favoriteFood: [mongoose.Types.ObjectId];

    @Prop()
    hashRT: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;


    @Prop()
    imageUrl: string

    @Prop({ default: 'user' })
    role: string;

}
export const CartSchema = SchemaFactory.createForClass(Cart)
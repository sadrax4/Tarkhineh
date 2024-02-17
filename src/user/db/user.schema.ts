import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import mongoose, { now } from "mongoose";


@Schema({ _id: false })
class OTP {
    @Prop()
    code: number;

    @Prop()
    expireIn: number
}

@Schema({ _id: false })
class AnotherReceiver {

    @Prop({ required: true })
    addressTitle: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    name: string;

}

@Schema()
class Address extends AbstractDocument {

    @Prop()
    addressTitle?: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    ownReceiver: boolean;

    @Prop({ type: AnotherReceiver })
    anotherReceiver?: AnotherReceiver;

}

@Schema({ _id: false })
class FoodDetail {

    @Prop()
    foodId: mongoose.Types.ObjectId

    @Prop({ min: 0, default: 1 })
    quantity: number
}

@Schema({ _id: false })
class CartDetail {

    @Prop({ type: [FoodDetail] })
    foodDetail: FoodDetail[]

    @Prop({ min: 0, default: 0 })
    totalPayment: number

    @Prop({ required: false })
    discountCode: string;
}

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'user',
    virtuals: true,
})
export class User extends AbstractDocument {

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    username: string;

    @Prop({ type: OTP })
    otp: OTP;

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

    @Prop({ type: [Address] })
    address: Address[];

    @Prop({ type: [mongoose.Types.ObjectId] })
    favoriteFood: [mongoose.Types.ObjectId];

    @Prop()
    hashRT: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;

    @Prop({ type: [mongoose.Types.ObjectId] })
    comments: [mongoose.Types.ObjectId]

    @Prop()
    imageUrl: string

    @Prop({ default: 'user' })
    role: string;

    @Prop({ type: CartDetail })
    carts: CartDetail

}
export const UserSchema = SchemaFactory.createForClass(User)


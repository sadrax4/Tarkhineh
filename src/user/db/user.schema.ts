import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose, { now } from "mongoose";

@Schema({ _id: false })
class OTP {
    @Prop()
    code: number;

    @Prop()
    expireIn: number
}

@Schema({ _id: false })
class FavoriteFood {

    @Prop({ type: [mongoose.Types.ObjectId], required: true })
    foodID: [mongoose.Types.ObjectId];

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
class Address extends AbstractDocument  {

    @Prop()
    addressTitle?: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    ownReceiver: boolean;

    @Prop({ type: AnotherReceiver })
    anotherReceiver?: AnotherReceiver;

}

@Schema({ versionKey: false, collection: 'user' })
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
    birthday: string;

    @Prop()
    image: string;

    @Prop({ type: [Address] })
    address: Address[];

    @Prop({ type: FavoriteFood })
    favoriteFood: FavoriteFood;

    @Prop()
    hashRT: string;

    @Prop({default: now()})
    createdAt: Date;

    @Prop({default: now()})
    updatedAt: Date;

}
export const UserSchema = SchemaFactory.createForClass(User)

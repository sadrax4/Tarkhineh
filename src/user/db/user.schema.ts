import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose from "mongoose";

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
class Address {

    @Prop({ required: true })
    addressTitle: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

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

    @Prop({ type: Address })
    address: Address;

    @Prop({ type: FavoriteFood })
    favoriteFood: FavoriteFood;

}
export const UserSchema = SchemaFactory.createForClass(User)

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose, { now } from "mongoose";

@Schema({ _id: false })
class Reply {
    @Prop()
    name: string

    @Prop()
    family: string

    @Prop({ required: false, default: Date.now })
    createdAt?: string;

    @Prop()
    text: string

    @Prop()
    imageUrl: string

}

@Schema({ versionKey: false, collection: 'comments' })
export class Comment extends AbstractDocument {

    @Prop({
        required: true,
        type: mongoose.Types.ObjectId
    })
    author: mongoose.Types.ObjectId;

    @Prop({
        required: true,
        type: mongoose.Types.ObjectId
    })
    foodId: mongoose.Types.ObjectId;

    @Prop()
    text: string;

    @Prop({ default: Date.now })
    createdAt: string;

    @Prop({ default: false })
    show: boolean

    @Prop({ type: Reply })
    reply: Reply;

    @Prop({ min: 1, max: 5 })
    rate: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
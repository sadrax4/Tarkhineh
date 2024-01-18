import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";
import mongoose, { now } from "mongoose";

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

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: false })
    show: boolean

    @Prop({
        type: mongoose.Types.ObjectId
    })
    answer: mongoose.Types.ObjectId;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);
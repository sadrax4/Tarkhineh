import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import mongoose, { now } from "mongoose";

@Schema({ _id: false })
class Reply {
    @Prop()
    name: string

    @Prop()
    family: string

    @Prop()
    imageUrl: string

}

@Schema({ _id: false })
class Author {

    @Prop()
    author: Reply[]

    @Prop({ required: false, default: Date.now })
    createdAt?: number;

    @Prop()
    text: string
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
    createdAt: number;

    @Prop({ default: true })
    show: boolean

    @Prop({ type: Author })
    reply: Author

    @Prop({ min: 1, max: 5 })
    rate: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
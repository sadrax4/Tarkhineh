import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "libs/database";

@Schema({ versionKey: false, collection: 'categories' })
export class Category extends AbstractDocument {

    @Prop()
    title: string;

    @Prop()
    titleToEn: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";

@Schema({ collection: 'black_list', versionKey: false })
export class BlackList extends AbstractDocument {
    @Prop({ index: true, text: true })
    phones: string[];
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
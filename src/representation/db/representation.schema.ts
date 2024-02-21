import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import mongoose from "mongoose";

@Schema({ _id: false })
class Points {
    businessLicense: boolean
    kitchen: boolean
    parking: boolean
    Warehouse: boolean
}

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'representation',
    virtuals: true,
})
export class Representation extends AbstractDocument {

    @Prop()
    name: string;

    @Prop()
    phone: string

    @Prop()
    nationalCode: string

    @Prop()
    state: string

    @Prop()
    zone: string

    @Prop()
    city: string

    @Prop()
    ownership: string

    @Prop()
    buildAge: number

    @Prop({ type: Points })
    points: Points

    @Prop()
    imagesUrl: string[]

}
export const RepresentationSchema = SchemaFactory.createForClass(Representation)



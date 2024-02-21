import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import mongoose from "mongoose";



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
    
    @Prop()
    businessLicense: boolean

    @Prop()
    kitchen: boolean

    @Prop()
    parking: boolean

    @Prop()
    Warehouse: boolean

    @Prop()
    imagesUrl: string[]

}
export const RepresentationSchema = SchemaFactory.createForClass(Representation)



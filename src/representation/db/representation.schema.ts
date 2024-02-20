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
    phone: number

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
    buildAge: string

    @Prop()
    points: {
        businessLicense: boolean,
        kitchen: boolean,
        parking: boolean,
        Warehouse: boolean
    }
    
    @Prop()
    images: string[]

}
export const RepresentationSchema = SchemaFactory.createForClass(Representation)



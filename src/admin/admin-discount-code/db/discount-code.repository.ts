import { AbstractRepository } from "libs/database";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DiscountCode } from "./discount-code.schema";

export class CommentRepository
    extends AbstractRepository<DiscountCode> {
    constructor(
        @InjectModel(DiscountCode.name)
        DiscountCodeSchema: Model<DiscountCode>
    ) {
        super(DiscountCodeSchema)
    }
}
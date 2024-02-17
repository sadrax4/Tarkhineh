import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DiscountCode } from "./discount-code.schema";

export class DiscountCodeRepository
    extends AbstractRepository<DiscountCode> {
    constructor(
        @InjectModel(DiscountCode.name)
        DiscountCodeSchema: Model<DiscountCode>
    ) {
        super(DiscountCodeSchema)
    }
}
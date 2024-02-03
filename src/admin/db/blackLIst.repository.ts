import { AbstractRepository } from "libs/database";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlackList } from "./blackList.schema";

export class BlackListRepository
    extends AbstractRepository<BlackList> {
    constructor(
        @InjectModel(BlackList.name)
        AbandonPhonesSchema: Model<BlackList>
    ) {
        super(AbandonPhonesSchema)
    }
}
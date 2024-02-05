import { AbstractRepository } from "libs/database";
import { Food } from "./food.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class FoodRepository
    extends AbstractRepository<Food> {
    constructor(
        @InjectModel(Food.name)
        foodSchema: Model<Food>
    ) {
        super(foodSchema)
    }
}
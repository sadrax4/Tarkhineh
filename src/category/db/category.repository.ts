import { AbstractRepository } from "libs/database";
import { Category } from "./category.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class CategoryRepository extends AbstractRepository<Category> {
    constructor(
        @InjectModel(Category.name)
        private categorySchema: Model<Category>
    ) {
        super(categorySchema);
    }
}
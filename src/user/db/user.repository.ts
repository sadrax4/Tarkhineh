import { Injectable } from "@nestjs/common";
import { User } from './user.schema';
import { AbstractRepository } from "libs/database";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class UserRepository extends AbstractRepository<User> {
    constructor(
        @InjectModel(User.name)
        private userSchema: Model<User>
    ) {
        super(userSchema);
    }
}
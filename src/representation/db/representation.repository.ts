import { Injectable } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Representation } from "./representation.schema";


@Injectable()
export class RepresentationRepository extends AbstractRepository<Representation> {
    constructor(
        @InjectModel(Representation.name)
        private representationSchema: Model<Representation>
    ) {
        super(representationSchema);
    }
}
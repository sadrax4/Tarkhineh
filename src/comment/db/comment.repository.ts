import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment } from "./comment.schema";

export class CommentRepository
    extends AbstractRepository<Comment> {
    constructor(
        @InjectModel(Comment.name)
        commentSchema: Model<Comment>
    ) {
        super(commentSchema)
    }
}
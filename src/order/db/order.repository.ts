import { Injectable } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";


@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
    constructor(
        @InjectModel(Order.name)
        private orderSchema: Model<Order>
    ) {
        super(orderSchema);
    }
}
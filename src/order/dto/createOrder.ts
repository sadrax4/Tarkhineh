import { ObjectId } from "mongodb";

export class CreateOrderDto {

    userPhone: string;

    userId: ObjectId;

    addressId: ObjectId;

    totalPayment: number;

    description: string;

    invoiceNumber: number;

    authority: string;

    verify: boolean;

    paymentDate: string;

    carts: object;

}
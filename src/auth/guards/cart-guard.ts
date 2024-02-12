import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class CartGuard extends AuthGuard('cart') {
    handleRequest(err, user, info) {
        return user;
    }
}

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class PublicGuard extends AuthGuard('public') {
    handleRequest(err, user, info) {
        return user;
    }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class AddressSwaggerMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
        if (req.body.ownReceiver) {
            delete req?.body?.anotherReceiver;
        }
        else {
            delete req?.body?.addressTitle;
            delete req?.body?.description;
        }
        next();
    }
}
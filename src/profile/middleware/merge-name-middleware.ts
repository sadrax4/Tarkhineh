import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";

@Injectable()
export class MergeNameSwaggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'POST') {
            let { name: firstName, family: lastName } = req?.body;
            firstName = firstName.trim();
            lastName = lastName.trim();
            const name = firstName.concat(" ", lastName);
            delete req?.body?.name;
            delete req?.body?.family;
            req.body.name = name;
        }
        next();
    }
}
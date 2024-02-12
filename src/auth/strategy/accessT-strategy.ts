import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtPayload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private userService: UserService
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                let data = request.headers["access-token"] ?
                    request.headers["access-token"] :
                    request?.cookies["access-token"]
                console.log(data);
                return data ? data : null;
            }])
        })
    }
    async validate(
        payload: JwtPayload
    ): Promise<{ phone: string, username: string }> {
        if (!payload || payload == null) {
            throw new HttpException(
                "توکن نا معتبر ",
                HttpStatus.UNAUTHORIZED
            );
        }
        const {
            phone,
            username
        } = await this.userService.findUser(
            payload.phone
        )
        return {
            phone,
            username
        };
    }
}
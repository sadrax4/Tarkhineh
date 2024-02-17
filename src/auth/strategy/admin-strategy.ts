import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtPayload } from "../types";
import { Roles } from "@app/common";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(
        configService: ConfigService,
        private userService: UserService
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                let data = request?.headers["access-token"] ?
                    request?.headers["access-token"] :
                    request?.cookies["access-token"]
                return data ? data : null;
            }])
        })
    }
    async validate(
        payload: JwtPayload
    ): Promise<{ phone: string, username: string }> {
        if (!payload || payload == null || !payload.phone.startsWith("09")) {
            throw new HttpException(
                "توکن نا معتبر ",
                HttpStatus.UNAUTHORIZED
            );
        }
        const {
            phone,
            username,
            role
        } = await this.userService.findUser(
            payload.phone
        );
        if (role == Roles.user) {
            throw new HttpException(
                "اجازه دسترسی ندارید",
                HttpStatus.UNAUTHORIZED
            );
        }
        return {
            phone,
            username
        };
    }
}
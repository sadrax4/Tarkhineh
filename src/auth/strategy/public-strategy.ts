import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtPayload } from "../types";

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
    constructor(
        configService: ConfigService,
        private userService: UserService
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const data = request?.cookies['access-token'];
                if (!data) {
                    return null;
                }
                return data;
            }])
        })
    }
    async validate(
        payload: JwtPayload
    ): Promise<{ phone: string, username: string }> {
        if (!payload || payload == null) {
            return null;
        }
        const { phone, username } = await this.userService.findUser(payload.phone)
        return { phone, username };
    }
}
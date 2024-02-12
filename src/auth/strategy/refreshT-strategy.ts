import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "../types";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        configService: ConfigService
    ) {
        super({
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                let data = request?.headers["refresh-token"] ?
                    request?.headers["refresh-token"] :
                    request?.cookies["refresh-token"]
                console.log(data);
                return data ? data : null;
            }])
        })
    }
    async validate(
        request: Request,
        payload: JwtPayload
    ): Promise<{ phone: string }> {
        if (!payload || payload == null) {
            throw new HttpException(
                "توکن نا معتبر ",
                HttpStatus.FORBIDDEN
            );
        }
        const refreshToken = request?.cookies["refresh-token"];
        const phone = await this.authService.validRefreshToken(
            refreshToken,
            payload.phone
        );
        return {
            phone
        };
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generateOtpCode } from './utils/generate-otp-code';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant/error.constant';
import { SmsPanel } from './utils';
import { ResendCodeDto } from './dto/resend-code-dto';
import { Request, Response } from 'express';
import { JwtPayload } from './types/jwt-payload-type';
import { JwtService } from '@nestjs/jwt';
import { Token } from './types';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async getOtp(
        phone: string,
        response: any
    ): Promise<Response> {
        const otpCode: number = generateOtpCode();
        const date = new Date()
        const expireIn = date.setSeconds(
            date.getSeconds() + 111120
        );
        try {
            await this.userService.saveOtp(phone, otpCode, expireIn);
            const text = `ترخینه
            کد تایید : ${otpCode}
            `;
            //SmsPanel(phone, otpCode, text);
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "کد با موفقیت ارسال شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async checkOtp(
        phone: string,
        otpCode: number,
        response: Response
    ): Promise<Response> {
        const user = await this.userService.findUser(phone);
        const {
            expireIn: otpExpireIn,
            code: userCode
        } = user.otp;
        const now: number = new Date().getTime();
        if (now > otpExpireIn) {
            throw new HttpException(
                "کد وارد شده منقضی شده است", HttpStatus.UNAUTHORIZED
            )
        }
        if (userCode !== otpCode) {
            throw new HttpException(
                "کد وارد شده اشتباه است", HttpStatus.UNAUTHORIZED
            )
        }
        const tokens: Token = await this.getTokens(user.phone, user.username);
        const hashRT = await bcrypt.hash(tokens.refreshToken, 10);
        await this.userService.saveRefreshToken(phone, hashRT);
        const d = new Date();
        response.cookie(
            'access-token',
            tokens.accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: (d.getTime() + 1 * 3600 * 1000),
        }
        );
        response.cookie(
            "refresh-token",
            tokens.refreshToken,
            {
                httpOnly: false,
                secure: true,
                maxAge: (d.getTime() + 3 * 3600 * 24 * 1000),
                sameSite: "none"
            }
        );
        const successMessage = "ورود با موفقیت انجام شد";
        return response
            .status(HttpStatus.OK)
            .json({
                message: successMessage,
                statusCode: HttpStatus.OK
            })
    }

    async refreshToken(
        response: Response,
        refreshToken: string,
        userPhone: string
    ): Promise<Response | void> {
        const {
            hashRT,
            phone,
            username
        } = await this.userService.findUser(userPhone);
        const isTokensEqual: boolean = await bcrypt.compare(refreshToken, hashRT);
        if (!isTokensEqual) {
            return response.redirect(
                "https://tarkhineh.liara.run/v1/auth/get-otp"
            );
        }
        const isValidToken = await this.jwtService.verify(
            refreshToken,
            {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            }
        )
        if (!isValidToken) {
            return response.redirect(
                "https://tarkhineh.liara.run/v1/auth/get-otp"
            );
        }
        const tokens: Token = await this.getTokens(phone, username);
        const hashRefresh = await bcrypt.hash(tokens.refreshToken, 10);
        await this.userService.saveRefreshToken(phone, hashRefresh);
        const d = new Date();
        response.cookie(
            'access-token',
            tokens.accessToken,
            {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: (d.getTime() + 1 * 3600 * 1000)
            }
        );
        response.cookie(
            "refresh-token",
            tokens.refreshToken,
            {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: (d.getTime() + 3 * 3600 * 24 * 1000)
            }
        );
        const responseMessage = 'توکن جدید تولید شد'
        return response
            .status(HttpStatus.OK)
            .json({
                message: responseMessage,
                statusCode: HttpStatus.OK
            })
    }

    async logout(
        phone: string,
        response: Response
    ) {
        const d = new Date();
        response.clearCookie(
            "refresh-token",
            { httpOnly: true, secure: true }
        );
        response.clearCookie(
            "access-token",
            { httpOnly: true, secure: true }
        );
        delete response?.req?.user;
        delete response?.req?.cookies;
        delete response?.req?.rawHeaders[3];
        delete response?.req?.headers.cookie;
        await this.userService.removeRefreshToken(phone);
        const responseMessage: string = "خروج کاربر با موفقیت انجام شد"
        return response
            .status(HttpStatus.OK)
            .json({
                message: responseMessage,
                statusCode: HttpStatus.OK
            })
    }

    async resendCode
        (response: Response,
            { phone }: ResendCodeDto
        ): Promise<Response> {
        const {
            otp: { expireIn: otpExpireIn }
        } = await this.userService.findUser(phone);
        const now: number = new Date().getTime();
        if (now < otpExpireIn) {
            throw new HttpException(
                "مدت زمان ارسال کد مجدد ۲ دقیقه می باشد", HttpStatus.BAD_REQUEST
            )
        }
        const otpCode: number = generateOtpCode();
        const text = `ترخینه
            ارسال مجدد : ${otpCode}
            `;
        //SmsPanel(phone, otpCode, text);
        return response
            .status(HttpStatus.OK)
            .json({
                message: "کد با موفقیت ارسال شد",
                statusCode: HttpStatus.OK
            })
    }

    async getTokens(
        phone: string, userId: string
    ): Promise<Token> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            phone
        }
        const [
            accessToken,
            refreshToken
        ] = await Promise.all([
            this.jwtService.signAsync(
                jwtPayload, {
                secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
                expiresIn: '1h'
            }),
            this.jwtService.signAsync(
                jwtPayload, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
                expiresIn: '3d'
            })
        ])
        return {
            accessToken,
            refreshToken
        }
    }

    async validRefreshToken(
        refreshToken: string,
        userPhone: string
    ): Promise<string> {
        const {
            hashRT,
            phone
        } = await this.userService.findUser(userPhone);
        const isTokensEqual: boolean = await bcrypt.compare(
            refreshToken,
            hashRT
        );
        if (!isTokensEqual) {
            throw new HttpException(
                "توکن نا معتبر ", HttpStatus.UNAUTHORIZED
            );
        }
        const isValidToken = await this.jwtService.verify(
            refreshToken,
            {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            }
        )
        if (!isValidToken) {
            throw new HttpException(
                "توکن نا معتبر ", HttpStatus.UNAUTHORIZED
            );
        }
        return phone;
    }
}

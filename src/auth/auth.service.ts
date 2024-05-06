import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE, JwtPayload, SmsPanel, Token, generateOtpCode } from '@app/common';
import { ResendCodeDto } from './dto/resend-code-dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { AccessCookieConfig, RefreshCookieConfig } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async getOtp(
        phone: string,
        response: Response
    ): Promise<Response> {
        const otpCode: number = generateOtpCode();
        const date = new Date();
        const expireIn = date.setSeconds(
            date.getSeconds() + 120
        );
        try {
            await this.userService.saveOtp(
                phone,
                otpCode,
                expireIn
            );
            const text = `${otpCode}`;
            await SmsPanel(phone, text);
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "کد با موفقیت ارسال شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async checkOtp(
        phone: string,
        otpCode: number,
        response: Response
    ): Promise<Response> {
        try {
            const user = await this.userService.findUser(phone);
            const {
                expireIn: otpExpireIn,
                code: userCode
            } = user.otp;
            const now: number = new Date().getTime();
            if (now > otpExpireIn) {
                throw new HttpException(
                    "کد وارد شده منقضی شده است",
                    HttpStatus.UNAUTHORIZED
                )
            }
            if (userCode !== otpCode) {
                throw new HttpException(
                    "کد وارد شده اشتباه است",
                    HttpStatus.UNAUTHORIZED
                )
            }
            const tokens: Token = await this.getTokens(
                user.phone,
                user.username
            );
            const hashRT = await bcrypt.hash(
                tokens.refreshToken,
                10
            );
            await this.userService.saveRefreshToken(phone, hashRT);
            response.cookie(
                'access-token',
                tokens.accessToken,
                AccessCookieConfig
            );
            response.cookie(
                "refresh-token",
                tokens.refreshToken,
                RefreshCookieConfig
            );
            const successMessage = "ورود با موفقیت انجام شد";
            return response
                .status(HttpStatus.OK)
                .json({
                    tokens,
                    message: successMessage,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async refreshToken(
        response: Response,
        refreshToken: string,
        userPhone: string
    ): Promise<Response | void> {
        try {
            const {
                hashRT,
                phone,
                username
            } = await this.userService.findUser(userPhone);
            const isTokensEqual: boolean = await bcrypt.compare(
                refreshToken,
                hashRT
            );
            if (!isTokensEqual) {
                throw new HttpException(
                    "توکن نا معتبر ",
                    HttpStatus.UNAUTHORIZED
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
                    "توکن نا معتبر ",
                    HttpStatus.UNAUTHORIZED
                );
            }
            const tokens: Token = await this.getTokens(
                phone,
                username
            );
            const hashRefresh = await bcrypt.hash(
                tokens.refreshToken,
                10
            );
            await this.userService.saveRefreshToken(
                phone,
                hashRefresh
            );
            response.cookie(
                'access-token',
                tokens.accessToken,
                AccessCookieConfig
            );
            response.cookie(
                "refresh-token",
                tokens.refreshToken,
                RefreshCookieConfig
            );
            const responseMessage = 'توکن جدید تولید شد'
            return response
                .status(HttpStatus.OK)
                .json({
                    message: responseMessage,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async logout(
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const d = new Date();
            response.clearCookie(
                "refresh-token",
                {
                    sameSite: 'none',
                    httpOnly: false,
                    secure: true
                }
            );
            response.clearCookie(
                "access-token",
                {
                    sameSite: 'none',
                    httpOnly: false,
                    secure: true
                }
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async resendCode(
        response: Response,
        { phone }: ResendCodeDto
    ): Promise<Response> {
        try {
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
            ارسال مجدد: ${otpCode}
            `;
            SmsPanel(phone, text);
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "کد با موفقیت ارسال شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getTokens(
        phone: string, userId: string
    ): Promise<Token> {
        try {
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async validRefreshToken(
        refreshToken: string,
        userPhone: string
    ): Promise<string> {
        try {
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
            const isTokenValid = await this.jwtService.verify(
                refreshToken,
                {
                    secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
                }
            )
            if (!isTokenValid) {
                throw new HttpException(
                    "توکن نا معتبر ", HttpStatus.UNAUTHORIZED
                );
            }
            return phone;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getAccessToken(
        phone: string, userId: string
    ): Promise<string> {
        try {
            const jwtPayload: JwtPayload = {
                sub: userId,
                phone
            }
            const accessToken = await this.jwtService.signAsync(
                jwtPayload, {
                secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
                expiresIn: '1h'
            })
            return accessToken
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user-dto';
import { generateOtpCode } from './utils/generate-otp-code';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/constant/error.constant';
import { json } from 'stream/consumers';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) { }
    async login(loginUserDto: LoginUserDto, response) {

    }

    async getOtp(phone: string, response: Response) {
        const otpCode: number = generateOtpCode();
        const date = new Date()
        const expireIn = date.setSeconds(
            date.getSeconds() + this.configService.get("OTP_EXPIRE_TIME")
        );
        try {
            await this.userService.saveOtp(phone, otpCode, expireIn);
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.OK)
            .json({
                message: "کد با موفقیت ارسال شد",
                statusCode: HttpStatus.OK
            })
    }
}

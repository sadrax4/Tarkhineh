import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user-dto';
import { generateOtpCode } from './utils/generate-otp-code';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/constant/error.constant';
import { SmsPanel } from './utils/sms-panel';
import { ResendCodeDto } from './dto/resend-code-dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) { }
    async login(loginUserDto: LoginUserDto, response) {

    }
    async getOtp(phone: string, response: any) {
        const otpCode: number = generateOtpCode();
        const date = new Date()
        const expireIn = date.setSeconds(
            date.getSeconds() + this.configService.get("OTP_EXPIRE_TIME")
        );
        try {
            await this.userService.saveOtp(phone, otpCode, expireIn);
            const text = `ترخینه
            کد تایید : ${otpCode}
            `;
            await SmsPanel(phone, otpCode, text);
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
    async resendCode(response: Response, { phone }: ResendCodeDto) {
        try {
            const user = await this.userService.findUser(phone);

        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        const otpCode: number = generateOtpCode();
        const text = `ترخینه
            ارسال مجدد : ${otpCode}
            `;
        await SmsPanel(phone, otpCode, text);
        return response
            .status(HttpStatus.OK)
            .json({
                message: "",
                statusCode: HttpStatus.OK
            })
    }
}

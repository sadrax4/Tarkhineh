import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user-dto';
import { generateOtpCode } from './utils/generate-otp-code';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/constant/error.constant';
import axios from 'axios';
import { SmsPanel } from './utils/sms-panel';
import { ResendCodeDto } from './dto/resend-code-dto';

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
            await SmsPanel(phone, otpCode);
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
    async resendCode({ phone }: ResendCodeDto) {
        const otpCode: number = generateOtpCode();
        return await SmsPanel(phone, otpCode);
    }
}

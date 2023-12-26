import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user-dto';
import { generateOtpCode } from './utils/generate-otp-code';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/constant/error.constant';
import axios from 'axios';

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
            const result = await axios.post(
                "https://rest.payamak-panel.com/api/SendSMS/SendSMS",
                {
                    username: this.configService.get('SMS_USERNAME'),
                    password: this.configService.get('SMS_PASSWORD'),
                    from: this.configService.get('SMS_CONSUMER'),
                    to: "09338008554",
                    text: `ترخینه
                    کد تایید : ${otpCode}
                    `
                }
            )
            console.log(result);
            return response.status(HttpStatus.OK).json({
                message: "کد با موفقیت ارسال شد",
                statusCode: HttpStatus.OK
            })
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

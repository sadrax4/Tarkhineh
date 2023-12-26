import axios from "axios";
import { ConfigService } from '@nestjs/config'
import { HttpException, HttpStatus } from "@nestjs/common";
const configService = new ConfigService()
export async function SmsPanel(phone: string, otpCode: number): Promise<void> {
    const result = await axios.post(
        configService.get('SMS_URL'),
        {
            username: configService.get('SMS_USERNAME'),
            password: configService.get('SMS_PASSWORD'),
            from: configService.get('SMS_CONSUMER'),
            to: phone,
            text: `ترخینه
            کد تایید : ${otpCode}
            `
        }
    )
    if (result.data.Value.length <= 4) {
        throw new HttpException("خطا در ارسال کد", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}


import axios from "axios";
import { ConfigService } from '@nestjs/config'
const configService = new ConfigService()

export async function SmsPanel(phone: string, otpCode: number , text:string): Promise<void> {
    const result = await axios.post(
        configService.get('SMS_URL'),
        {
            username: configService.get('SMS_USERNAME'),
            password: configService.get('SMS_PASSWORD'),
            from: configService.get('SMS_CONSUMER'),
            to: phone,
            text
        }
    )
}


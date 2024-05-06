import axios from "axios";
import { ConfigService } from '@nestjs/config'
const configService = new ConfigService()

export async function SmsPanel(phone: string, text: string): Promise<void> {
    await axios.post(
        configService.get('SMS_URL'),
        {
            username: configService.get('SMS_USERNAME'),
            password: configService.get('SMS_PASSWORD'),
            bodyId: configService.get('AUTH_PATTERN'),
            to: phone,
            text
        }
    )
}


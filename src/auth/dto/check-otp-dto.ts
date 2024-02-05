import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";
const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد";


export class CheckOtpDto {
    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    @ApiProperty({
        title: "enter phone number for login",
        example: "09123456789",
        nullable: false
    })
    phone: string;

    @ApiProperty({
        type: 'integer',
        example: 12345,
    })
    otpCode: number;
}
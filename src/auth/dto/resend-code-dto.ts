import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد";
export class ResendCodeDto {

    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    @ApiProperty({
        title: "enter phone number for login",
        example: "09123456789",
        nullable: false
    })
    phone:string

}
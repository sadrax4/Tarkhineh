import { IsNotEmpty, IsPhoneNumber } from "class-validator";

const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد";
export class ResendCodeDto {

    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    phone:string
}
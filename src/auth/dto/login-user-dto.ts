import { IsNotEmpty, IsPhoneNumber } from "class-validator";

const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد";
export class LoginUserDto {

    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    readonly phone: string;

}
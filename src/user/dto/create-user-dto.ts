import { IsEmpty, IsNotEmpty, IsPhoneNumber, Matches } from "class-validator";
const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد"
export class CreateUserDto {
    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    readonly phone: string;
}
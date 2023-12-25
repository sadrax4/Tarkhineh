import {
    IsEmpty,
    IsNotEmpty,
    IsPhoneNumber,
    IsString
} from "class-validator";
const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد"

export class CreateUserDto {
    readonly phone: string;
}
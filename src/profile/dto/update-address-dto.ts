import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";
const errorMessage = "شماره تلفن وارد شده صحیح نمیباشد";

class AnotherReceiver {
    @ApiProperty({ required: false })
    addressTitle: string;

    @ApiProperty({ required: false })
    description: string;

    @IsNotEmpty({ message: errorMessage })
    @IsPhoneNumber('IR', { message: errorMessage })
    @ApiProperty({ required: false })
    phone: string;

    @ApiProperty({ required: false })
    name: string;
}
export class UpdateAddressDto {

    @ApiProperty({
        title: "enter  title of address",
        required: false,
    })
    addressTitle?: string;

    @ApiProperty({
        title: "enter description of address",
        required: false,
    })
    description?: string;

    @ApiProperty({
        required: false,
        type: AnotherReceiver
    })
    anotherReceiver?: AnotherReceiver;

    @ApiProperty({})
    ownReceiver: boolean;

}
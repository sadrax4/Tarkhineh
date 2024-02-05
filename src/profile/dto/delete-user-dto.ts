import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserDto {

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    username?: string;
}
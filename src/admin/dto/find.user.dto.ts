import { ApiProperty } from "@nestjs/swagger";

export class FindUserDto {
    @ApiProperty()
    phone: string
}
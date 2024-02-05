import { ApiProperty } from "@nestjs/swagger";

export class FindUserDto {
    @ApiProperty()
    query: string
}

export class BlackListDto {
    @ApiProperty()
    phone: string;
}
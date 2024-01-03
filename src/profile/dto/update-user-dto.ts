import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {

    name?: string;

    birthday?: string;

    email?: string;

    username?: string;
}

export class UpdateUserSwagger {

    @ApiProperty()
    name?: string;

    @ApiProperty()
    family?: string;

    @ApiProperty()
    birthday?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    username?: string;
}
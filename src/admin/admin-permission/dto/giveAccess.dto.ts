import { ApiProperty } from "@nestjs/swagger";

export class GiveAccessDto {
    @ApiProperty()
    phone: string;
}
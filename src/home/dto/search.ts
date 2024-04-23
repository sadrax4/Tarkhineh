import { ApiProperty } from "@nestjs/swagger";

export class SearchDto {
    @ApiProperty()
    search: string;
}
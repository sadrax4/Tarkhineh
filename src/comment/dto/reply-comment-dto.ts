import { ApiProperty } from "@nestjs/swagger";

export class ReplyCommentDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    family: string;

    @ApiProperty()
    text: string;
}
import { ApiProperty } from "@nestjs/swagger";

export class ReplyCommentDto {
    @ApiProperty()
    text: string;
}
import { ApiProperty } from "@nestjs/swagger";

export class IsShowCommentDto {
    @ApiProperty({})
    show: boolean
}
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDto {

    @ApiProperty()
    @IsString()
    foodId: string;

    @ApiProperty()
    @IsString()
    text: string;

    author?: string;

}
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto {
    @ApiProperty({
        required: false
    })
    title?: string;

    @ApiProperty({
        required: false
    })
    titleToEn?: string;
}
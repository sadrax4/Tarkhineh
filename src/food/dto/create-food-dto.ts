import { ApiProperty } from "@nestjs/swagger";

export class CreateFoodDto {

    @ApiProperty({ required: false })
    title?: string;

    @ApiProperty({ required: false })
    ingredients?: string[];

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ required: false })
    price?: number;

    @ApiProperty({ required: false })
    discount?: number;

    @ApiProperty({ required: false })
    quantity?: number;

    @ApiProperty({ required: false })
    category?: string[];

    @ApiProperty({ required: false })
    subCategory?: string[];

    @ApiProperty({ format: 'binary', isArray: true, required: false })
    images?: string[];

    @ApiProperty({ required: false })
    imagesUrl?: string[];
}
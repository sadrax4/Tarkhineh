import { ApiProperty } from "@nestjs/swagger";
import { Binary } from "mongodb";

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
    mainCategory?: string[];

    @ApiProperty({ required: false })
    subCategory?: string[];

    @ApiProperty({ format: 'binary', isArray: true, required: false })
    images?: string;
}
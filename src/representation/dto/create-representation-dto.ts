import { ApiProperty } from "@nestjs/swagger";

type Points = {
    businessLicense: boolean
    kitchen: boolean
    parking: boolean
    Warehouse: boolean
}

export class CreateRepresentationDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    phone: number

    @ApiProperty()
    nationalCode: string

    @ApiProperty()
    state: string

    @ApiProperty()
    zone: string

    @ApiProperty()
    city: string

    @ApiProperty()
    ownership: string

    @ApiProperty()
    buildAge: string

    @ApiProperty()
    points: Points

    @ApiProperty({ required: false })
    imagesUrl: string[]

}
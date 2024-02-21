import { ApiProperty } from "@nestjs/swagger";

export class CreateRepresentationDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    phone: string

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
    buildAge: number

    @ApiProperty()
    businessLicense: boolean

    @ApiProperty()
    kitchen: boolean

    @ApiProperty()
    parking: boolean

    @ApiProperty()
    Warehouse: boolean

    @ApiProperty({ required: false })
    imagesUrl: string[]

}
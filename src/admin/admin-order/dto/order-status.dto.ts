import { ApiProperty } from "@nestjs/swagger";

export class OrderStatusDto {
    @ApiProperty()
    status: string;
}
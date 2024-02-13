import { ApiProperty } from "@nestjs/swagger";

export class RemoveCartDto {
    @ApiProperty()
    foodId: string;
}
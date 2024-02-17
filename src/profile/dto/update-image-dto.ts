import { ApiProperty } from "@nestjs/swagger";
import { MulterFile } from "@app/common";

export class UpdateImageDto {

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: MulterFile

}
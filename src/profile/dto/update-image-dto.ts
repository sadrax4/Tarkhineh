import { ApiProperty } from "@nestjs/swagger";
import { MulterFile } from "src/common/types";

export class UpdateImageDto {

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: MulterFile

}
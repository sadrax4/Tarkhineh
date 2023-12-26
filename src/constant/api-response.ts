import { ApiResponseProperty } from "@nestjs/swagger";

export class ResponseMessage {
    @ApiResponseProperty()
    message: string;
    @ApiResponseProperty()
    statusCode: number;
}
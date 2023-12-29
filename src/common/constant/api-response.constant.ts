import { ApiResponseProperty } from "@nestjs/swagger";

export class OkResponseMessage {
    @ApiResponseProperty()
    message: string;
    @ApiResponseProperty()
    statusCode: number;
}

export class UnAuthorizeResponseMessage {
    @ApiResponseProperty()
    message: string;
    @ApiResponseProperty()
    statusCode: number;
;
}
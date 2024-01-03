import { FileTypeValidator, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, UploadedFile } from "@nestjs/common";

export function CheckRequiredUploadedFile(
    fileType: string | RegExp,
    size: number = 10
) {
    return UploadedFile(
        new ParseFilePipe({
            fileIsRequired: false,
            validators: [
                new MaxFileSizeValidator({ maxSize: size * 1024 * 1024 }),
                new FileTypeValidator({ fileType, }),
            ],
            exceptionFactory(error) {
                throw new HttpException(
                    error,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            },
        })
    )
}
export function CheckOptionalUploadedFile(
    fileType: string | RegExp,
    size: number = 10
) {
    return UploadedFile(
        new ParseFilePipe({
            fileIsRequired: false,
            validators: [
                new MaxFileSizeValidator({ maxSize: size * 1024 * 1024 }),
                new FileTypeValidator({ fileType, })
            ]
        })
    )
}
import { FileTypeValidator, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UploadedFiles } from "@nestjs/common";
import { UploadFile } from "../interceptors";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterFile } from "../types";

export function CheckRequiredUploadedFile(
    fileType: string | RegExp,
    size: number
) {
    return UploadedFiles(
        new ParseFilePipe({
            fileIsRequired: false,
            validators: [
                new MaxFileSizeValidator({ maxSize: size * 1024 * 1024 }),
                new FileTypeValidator({ fileType }),
            ],
            exceptionFactory(error) {
                throw new HttpException(
                    error,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        })
    )
}
export function CheckOptionalUploadedFile(
    fileType: string | RegExp,
    size: number = 10
) {
    return UploadedFiles(
        new ParseFilePipe({
            fileIsRequired: false,
            validators: [
                new MaxFileSizeValidator({ maxSize: size * 1024 * 1024 }),
                new FileTypeValidator({ fileType, })
            ]
        })
    )
}
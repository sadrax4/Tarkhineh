import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { MulterFile } from "../types";
import { Request } from "express";
import { MIMETYPE } from "../constant";
import { HttpException, HttpStatus } from "@nestjs/common";

export function UploadFile(fieldName: string) {
    return FilesInterceptor(fieldName, 10, {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        storage: diskStorage({
            destination: join("public", "upload", "image"),
            filename: (req: Request, file: MulterFile, callback) => {
                const ext = extname(file.originalname);
                if (!MIMETYPE.IMAGE.includes(ext)) {
                    return callback(
                        new HttpException("invalid file type", HttpStatus.BAD_REQUEST),
                        null
                    )
                }
                const newName = `${Date.now()}${ext}`;
                callback(null, newName);
            }
        }),
    })
}
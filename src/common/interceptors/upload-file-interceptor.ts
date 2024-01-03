import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { MulterFile } from "../types";
import { Request } from "express";

export function UploadFile(fieldName: string) {
    return FilesInterceptor(fieldName, 10, {
        storage: diskStorage({
            destination: join("public", "upload", "image"),
            filename: (req: Request, file: MulterFile, callback) => {
                const ext = extname(file.originalname);
                const newName = `${Date.now()}${ext}`;
                callback(null, newName);
            },
        }),
    })
}
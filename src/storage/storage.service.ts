import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@app/common';

@Injectable()
export class StorageService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    private s3Client = new S3Client({
        region: "default",
        endpoint: this.configService.get<string>('LIARA_ENDPOINT'),
        credentials: {
            accessKeyId: this.configService.get<string>('LIARA_ACCESS_KEY'),
            secretAccessKey: this.configService.get<string>('LIARA_SECRET_KEY')
        }
    })

    async uploadSingleFile(
        filename: string,
        file: Buffer,
        folder: string
    ): Promise<void> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Body: file,
                    Bucket: this.configService.get<string>('LIARA_BUCKET_NAME'),
                    Key: `${folder}/${filename}`
                })
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async uploadMultiFile(
        files: Express.Multer.File[],
        folder: string
    ): Promise<void> {
        try {
            const storageQueries = files.map(
                file => {
                    return this.s3Client.send(
                        new PutObjectCommand({
                            Body: file.buffer,
                            Bucket: this.configService.get<string>('LIARA_BUCKET_NAME'),
                            Key: `${folder}/${file.filename}`
                        })
                    )
                }
            )
            await Promise.all(storageQueries);
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteFile(
        filename: string,
        folder: string
    ): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.configService.get<string>('LIARA_BUCKET_NAME'),
                    Key: `${folder}/${filename}`
                })
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    
    getFileLink(
        filename: string,
        folder: string
    ): string {
        return `${this.configService.get<string>("LIARA_FILE_PATH_URL")}/${folder}/${filename}`;
    }
}

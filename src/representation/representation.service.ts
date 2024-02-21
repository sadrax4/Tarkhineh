import { INTERNAL_SERVER_ERROR_MESSAGE, REPRESENTATION_FOLDER, deleteInvalidValue } from '@app/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRepresentationDto } from './dto';
import { StorageService } from 'src/storage/storage.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { RepresentationRepository } from './db/representation.repository';

@Injectable()
export class RepresentationService {
    constructor(
        private storageService: StorageService,
        private readonly representationRepository: RepresentationRepository,
    ) { }

    async createRepresentation(
        createRepresentationDto: CreateRepresentationDto,
        images: Express.Multer.File[],
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createRepresentationDto);
        createRepresentationDto.imagesUrl = images.map(
            image => {
                return this.storageService.getFileLink(
                    image.filename,
                    REPRESENTATION_FOLDER
                )
            })
        const representationData = {
            _id: new Types.ObjectId(),
            ...createRepresentationDto,
        }
        try {
            await Promise.all([
                this.storageService.uploadMultiFile(
                    images,
                    REPRESENTATION_FOLDER
                ),
                this.representationRepository.create(
                    representationData
                )
            ])
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "نمایندگی با موفقیت ثبت شد",
                statusCode: HttpStatus.CREATED
            })
    }
}

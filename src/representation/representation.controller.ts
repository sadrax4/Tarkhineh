import { MIMETYPE, MulterFile, OkResponseMessage, UploadMultiFilesAws } from '@app/common';
import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RepresentationService } from './representation.service';
import { CreateRepresentationDto } from './dto';
import { representationSchema } from './config';

@Controller('representation')
export class RepresentationController {
    constructor(
        private representationService: RepresentationService
    ) { }

    @ApiOperation({ summary: "create representation " })
    @ApiBody(representationSchema)
    @UseInterceptors(UploadMultiFilesAws('imagesUrl'))
    @ApiTags('representation')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post()
    async createRepresentation(
        @UploadedFiles() images: Array<MulterFile>,
        @Body() createRepresentationDto: CreateRepresentationDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.representationService.createRepresentation(
            createRepresentationDto,
            images,
            response
        )
    }

    @ApiOperation({ summary: "get representations " })
    @ApiTags('representation')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get()
    async getRepresentations(
        @Res() response: Response
    ): Promise<Response> {
        return this.representationService.getRepresentations(
            response
        )
    }

    @ApiOperation({ summary: "update representation " })
    @ApiBody(representationSchema)
    @UseInterceptors(UploadMultiFilesAws('imagesUrl'))
    @ApiTags('representation')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch(":id")
    async updateRepresentation(
        @UploadedFiles() images: Array<MulterFile>,
        @Query("id") representationId: string,
        @Body() updateRepresentationDto: CreateRepresentationDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.representationService.updateRepresentation(
            representationId,
            updateRepresentationDto,
            images,
            response
        )
    }

    @ApiOperation({ summary: "delete representation " })
    @ApiTags('representation')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete(":id")
    async deleteRepresentation(
        @Query("id") representationId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.representationService.deleteRepresentation(
            representationId,
            response
        )
    }
}

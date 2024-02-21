import { MIMETYPE, MulterFile, OkResponseMessage, UploadMultiFilesAws } from '@app/common';
import { Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RepresentationService } from './representation.service';

@Controller('representation')
export class RepresentationController {
    constructor(
        private representationService: RepresentationService
    ) { }

    @ApiOperation({ summary: "create food " })
    @ApiBody()
    @UseInterceptors(UploadMultiFilesAws('images'))
    @ApiTags('food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post()
    async createFood(
        @UploadedFiles() images: Array<MulterFile>,
        @Body() createFoodDto: CreateFoodDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.representationService.createRepresenation(
            createFoodDto,
            images,
            response
        )
    }
}

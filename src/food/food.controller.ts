import { Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateFoodDto } from './dto';
import { Response } from 'express';
import { FoodService } from './food.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { foodSchema } from './config';
import { UploadFile } from 'src/common/interceptors';
import { CheckRequiredUploadedFile } from 'src/common/decorators';
import { MulterFile } from 'src/common/types';
import { MIME_TYPE } from 'src/common/enums';

@Controller('food')
export class FoodController {
    constructor(
        private foodService: FoodService
    ) { }

    @ApiBody(foodSchema)
    @UseInterceptors(UploadFile('images'))
    @ApiTags('food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post()
    async createFood(
        @CheckRequiredUploadedFile(MIME_TYPE.IMAGE) images: Array<MulterFile>,
        @Body() createFoodDto: CreateFoodDto,
        @Res() response: Response
    ): Promise<Response> {
        createFoodDto.images = images.map(image => image.filename)
        return this.foodService.createFood(
            createFoodDto,
            response
        )
    }
}

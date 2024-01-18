import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateFoodDto } from './dto';
import { Response } from 'express';
import { FoodService } from './food.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';
import { foodSchema } from './config';
import { UploadFile, UploadMultiFiles } from 'src/common/interceptors';
import { MulterFile } from 'src/common/types';

@Controller('food')
export class FoodController {
    constructor(
        private foodService: FoodService
    ) { }

    @ApiBody(foodSchema)
    @UseInterceptors(UploadMultiFiles('images'))
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
        createFoodDto.images = images.map(image => image.filename)
        return this.foodService.createFood(
            createFoodDto,
            response
        )
    }


    @ApiTags('food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('list')
    async getFoods(
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.getFoods(
            response
        )
    }

    @ApiTags('food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get(':id')
    async getFoodById(
        @Param("id") foodId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.getFoodById(
            foodId,
            response
        )
    }

    @ApiTags('food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Delete(':id')
    async deleteFoodById(
        @Param("id") foodId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.deleteFoodById(
            foodId,
            response
        )
    }
}

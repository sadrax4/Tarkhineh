import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminFoodService } from './admin-food.service';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { AdminGuard } from 'src/auth/guards';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StringToArray } from 'src/common/decorators';
import { MulterFile } from 'src/common/types';
import { CreateFoodDto, UpdateFoodDto } from 'src/food/dto';
import { FoodService } from 'src/food/food.service';
import { foodSchema } from 'src/food/config';
import { UploadMultiFilesAws } from 'src/common/interceptors';

@Controller('admin')
export class AdminFoodController {
    constructor(
        private adminFoodService: AdminFoodService,
        private foodService: FoodService
    ) { }

    @UseGuards(AdminGuard)
    @ApiTags('admin-food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("foods")
    async getFood(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminFoodService.getFoods(
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiBody(foodSchema)
    @UseInterceptors(UploadMultiFilesAws('images'))
    @ApiTags('admin-food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post("foods")
    async createFood(
        @StringToArray("ingredients") _: null,
        @UploadedFiles() images: Array<MulterFile>,
        @Body() createFoodDto: CreateFoodDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.createFood(
            createFoodDto,
            images,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiBody(foodSchema)
    @UseInterceptors(UploadMultiFilesAws('images'))
    @ApiTags('admin-food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Patch("foods/:id")
    async updateFood(
        @StringToArray("ingredients") _: null,
        @UploadedFiles() images: Array<MulterFile>,
        @Body() updateFoodDto: UpdateFoodDto,
        @Param("id") foodId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.updateFood(
            foodId,
            updateFoodDto,
            images,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiTags('admin-food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Delete("foods/:id")
    async deleteFood(
        @Param("id") foodId: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.foodService.deleteFoodById(
            foodId,
            response
        );
    }
}

import { Body, Controller, Get, HttpStatus, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminFoodService } from './admin-food.service';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { JwtGuard } from 'src/auth/guards';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StringToArray } from 'src/common/decorators';
import { MulterFile } from 'src/common/types';
import { CreateFoodDto } from 'src/food/dto';
import { FoodService } from 'src/food/food.service';
import { foodSchema } from 'src/food/config';
import { UploadMultiFilesAws } from 'src/common/interceptors';

@Controller('admin')
export class AdminFoodController {
    constructor(
        private adminFoodService: AdminFoodService,
        private foodService: FoodService
    ) { }

    @UseGuards(JwtGuard)
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

    // @UseGuards(JwtGuard)
    // @ApiBody(foodSchema)
    // @UseInterceptors(UploadMultiFilesAws('images'))
    // @ApiTags('admin-food')
    // @ApiConsumes(MIMETYPE.MULTIPART)
    // @ApiResponse({
    //     type: OkResponseMessage,
    //     status: HttpStatus.CREATED
    // })
    // @Post("foods")
    // async createFood(
    //     @StringToArray("ingredients") _: null,
    //     @UploadedFiles() images: Array<MulterFile>,
    //     @Body() createFoodDto: CreateFoodDto,
    //     @Res() response: Response
    // ): Promise<Response> {
    //     return this.foodService.createFood(
    //         CreateFoodDto
    //         response
    //     );
    // }
}

import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateFoodDto, UpdateFoodDto } from './dto';
import { Response } from 'express';
import { FoodService } from './food.service';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';
import { foodSchema } from './config';
import { UploadMultiFilesAws } from 'src/common/interceptors';
import { MulterFile } from 'src/common/types';
import { ConfigService } from '@nestjs/config';
import { GetCurrentUser } from 'src/common/decorators';
import { JwtGuard } from 'src/auth/guards';

@Controller('food')
export class FoodController {

    constructor(
        private foodService: FoodService,
        private configService: ConfigService,
    ) { }

    @UseGuards(JwtGuard)
    @ApiBody(foodSchema)
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
        return this.foodService.createFood(
            createFoodDto,
            images,
            response
        )
    }

    @UseGuards(JwtGuard)
    @ApiTags('food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiQuery({ name: "main", required: false })
    @ApiQuery({ name: "sub", required: false })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @Get()
    async getFoodsByCategory(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response,
        @Query('main') mainCategory: string,
        @Query('sub') subCategory: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<Response> {
        return this.foodService.getFoodsByCategory(
            phone,
            mainCategory ? mainCategory : null,
            subCategory ? subCategory : null,
            page ? page : this.configService.get<number>("PAGE"),
            limit ? limit : this.configService.get<number>("LIMIT"),
            response
        )
    }

    @UseGuards(JwtGuard)
    @ApiTags('food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('list')
    async getFoods(
        @Res() response: Response,

    ): Promise<Response> {
        return this.foodService.getFoods(
            response
        )
    }

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
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
    
    @UseGuards(JwtGuard)
    @ApiBody(foodSchema)
    @UseInterceptors(UploadMultiFilesAws('images'))
    @ApiTags('food')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch("/:foodId")
    async updateFood(
        @UploadedFiles() images: Array<MulterFile>,
        @Body() updateFoodDto: UpdateFoodDto,
        @Res() response: Response,
        @Param("foodId") foodId: string
    ): Promise<Response> {
        return this.foodService.updateFood(
            foodId,
            updateFoodDto,
            images,
            response
        )
    }
}

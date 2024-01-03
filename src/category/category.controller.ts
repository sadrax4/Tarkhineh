import { Body, Controller, Get, Post, Res, Patch, Query, HttpStatus, Delete } from '@nestjs/common';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from './dto';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @ApiBody({
        type: CreateCategoryDto,
        required: true
    })
    @ApiTags('category')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post()
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.categoryService.createCategory(
            createCategoryDto,
            response
        );
    }

    @ApiBody({
        type: DeleteCategoryDto,
        required: true
    })
    @ApiTags('category')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete()
    async deleteCategory(
        @Body() deleteCategoryDto: DeleteCategoryDto,
        @Res() response: Response
    ): Promise<Response> {
        return this.categoryService.deleteCategory(
            deleteCategoryDto,
            response
        );
    }

    @ApiBody({
        type: UpdateCategoryDto,
        required: true
    })
    @ApiTags('category')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch(":id")
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Query('id') id: string,
        @Res() response: Response
    ): Promise<Response> {
        return this.categoryService.updateCategory(
            id,
            updateCategoryDto,
            response
        );
    }
}

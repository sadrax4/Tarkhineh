import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category-dto';
import { Response } from 'express';
import { CategoryRepository } from './db/category.repository';
import { DeleteCategoryDto } from './dto';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository
    ) { }

    async createCategory(
        createCategoryDto: CreateCategoryDto,
        response: Response
    ): Promise<Response> {
        try {
            const categoryData = {
                _id: new Types.ObjectId(),
                ...createCategoryDto
            }
            const createResult = await this.categoryRepository.create(
                categoryData
            );
            if (!createResult) {
                throw new HttpException(
                    INTERNAL_SERVER_ERROR_MESSAGE,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "دسته بندی با موفقیت ایجاد شد",
                statusCode: HttpStatus.CREATED
            });
    }

    async deleteCategory(
        deleteCategoryDto: DeleteCategoryDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.categoryRepository.deleteOne({
                _id: deleteCategoryDto.id
            });
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "دسته بندی با موفقیت حذف  شد",
                statusCode: HttpStatus.CREATED
            });
    }

    async updateCategory(
        id: string,
        updateCategory: UpdateCategoryDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.categoryRepository.findOneAndUpdate(
                { _id: id },
                { $set: updateCategory }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "دسته بندی با موفقیت  به روز رسانی  شد",
                statusCode: HttpStatus.CREATED
            });
    }
}

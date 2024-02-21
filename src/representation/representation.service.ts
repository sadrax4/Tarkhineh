import { Injectable } from '@nestjs/common';

@Injectable()
export class RepresentationService {

    async createFood(
        createFoodDto: CreateFoodDto,
        images: Express.Multer.File[],
        response: Response
    ): Promise<Response> {
        deleteInvalidValue(createFoodDto);
        createFoodDto.images = images.map(
            image => image.filename
        )
        createFoodDto.imagesUrl = images.map(
            image => {
                return this.storageService.getFileLink(
                    image.filename,
                    FOOD_FOLDER
                )
            })
        const foodData = {
            _id: new Types.ObjectId(),
            ...createFoodDto,
        }
        try {
            await Promise.all([
                this.storageService.uploadMultiFile(
                    images,
                    FOOD_FOLDER
                ),
                this.foodRepository.create(
                    foodData
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
                message: "غذا با موفقیت ثبت شد",
                statusCode: HttpStatus.CREATED
            })
    }
}

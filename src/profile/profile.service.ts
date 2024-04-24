import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateAddressDto, DeleteUserDto, UpdateAddressDto, UpdateUserDto } from './dto';
import { Response } from 'express';
import { deleteInvalidValue, pagination, USER_FOLDER } from '@app/common';
import { StorageService } from 'src/storage/storage.service';
import { FoodService } from '../food/food.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class ProfileService {
    constructor(
        private userService: UserService,
        private storageService: StorageService,
        private foodService: FoodService,
        private orderService: OrderService
    ) { }

    async updateUser(
        updateUserDto: UpdateUserDto,
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.checkUsernameExists(
                updateUserDto.username,
                phone
            )
            deleteInvalidValue(updateUserDto);
            await this.userService.updateUser(
                updateUserDto,
                phone
            )
            return response
                .status(HttpStatus.CREATED)
                .json({
                    message: "کاربر با موفقیت به روز رسانی  شد",
                    statusCode: HttpStatus.CREATED
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async deleteUser(
        deleteUserDto: DeleteUserDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.deleteUser(deleteUserDto)
            return response
                .status(HttpStatus.CREATED)
                .json({
                    message: "کاربر با موفقیت حذف شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getUserOrders(
        phone: string,
        filterQuery: string,
        response: Response
    ): Promise<Response> {
        try {
            const userOrders = await this.orderService.getUserOrders(
                phone,
                filterQuery
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    userOrders,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async cancelOrder(
        orderId: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.orderService.cancelOrder(
                orderId
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "سفارش با موفقیت لغو شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async createAddress(
        phone: string,
        createAddressDto: CreateAddressDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.createAddress(
                phone,
                createAddressDto
            );
            return response
                .status(HttpStatus.CREATED)
                .json({
                    message: "ادرس با موفقیت ثبت شد",
                    statusCode: HttpStatus.CREATED
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async updateAddress(
        addressId: string,
        response: Response,
        updateAddressDto: UpdateAddressDto,
    ): Promise<Response> {
        try {
            await this.userService.updateAddress(
                addressId,
                updateAddressDto,
            );
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "ادرس با موفقیت به روز  شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async deleteAddress(
        addressId: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.deleteAddress(addressId);
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "ادرس با موفقیت حذف  شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getAddress(
        phone: string,
        username: string,
        page: number,
        limit: number,
        response: Response
    ): Promise<Response> {
        try {
            const [
                maxPage,
                userAddresses
            ] = await this.userService.getAddress(
                phone,
                page,
                limit
            );
            const addresses = userAddresses.map(
                (address) => {
                    if (!address.ownReceiver) {
                        let {
                            addressTitle,
                            description,
                            phone,
                            name
                        } = address.anotherReceiver;
                        return {
                            _id: address._id,
                            addressTitle,
                            description,
                            phone, name,
                            ownReceiver: address.ownReceiver
                        }
                    } else {
                        const {
                            addressTitle,
                            description,
                            ownReceiver,
                            _id,
                        } = address;
                        return {
                            _id,
                            phone,
                            name: username,
                            addressTitle,
                            description,
                            ownReceiver
                        }
                    }
                })
            return response
                .status(HttpStatus.OK)
                .json({
                    data: addresses,
                    maxPage
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async updateImage(
        phone: string,
        file: Express.Multer.File,
        response: Response
    ): Promise<Response> {
        try {
            const imageUrl = this.storageService.getFileLink(
                file.filename,
                USER_FOLDER
            )
            const storageQuery = this.storageService.uploadSingleFile(
                file.filename,
                file.buffer,
                USER_FOLDER
            )
            const userQuery = this.userService.updateImage(
                phone,
                file.filename,
                imageUrl
            )
            await Promise.all([
                storageQuery,
                userQuery
            ])
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "بروفایل کاربر با موفقیت به روز رسانی شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async deleteImage(
        phone: string,
        response: Response
    ): Promise<Response> {
        try {
            const {
                imageUrl,
                image
            } = await this.userService.findUser(
                phone
            );
            if (!image) {
                throw new HttpException(
                    "کاربر فاقد عکس میباشد",
                    HttpStatus.BAD_REQUEST
                )
            }
            const storageQuery = this.storageService.deleteFile(
                image,
                USER_FOLDER
            )
            const userQuery = this.userService.deleteImage(
                phone
            )
            await Promise.all([
                storageQuery,
                userQuery
            ])
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "بروفایل کاربر با موفقیت به حذف شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async addFavoriteFood(
        phone: string,
        foodId: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.addFavoriteFood(phone, foodId);
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "غذا به لیست مورد پسند اضافه شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async removeFavoriteFood(
        phone: string,
        foodId: string,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.removeFavoriteFood(
                phone,
                foodId
            );
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "غذا از لیست مورد پسند حذف شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getFavoriteFood(
        phone: string,
        mainCategory: string,
        page: number,
        limit: number,
        query: string,
        response: Response
    ): Promise<Response> {
        try {
            const favoriteFoodId = await this.userService.getFavoriteFoodId(
                phone
            );
            let favoriteFood = await this.foodService.getFavoriteFood(
                favoriteFoodId,
                mainCategory,
                page,
                limit,
                query
            )
            const maxPage = Math.ceil(
                favoriteFood?.length / limit
            )
            favoriteFood = pagination(
                favoriteFood,
                limit,
                page
            );
            return response
                .status(HttpStatus.OK)
                .json({
                    favoriteFood,
                    maxPage,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

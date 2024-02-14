import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from '../user/db/user.repository';
import mongoose, { Types } from 'mongoose';
import { User } from './db/user.schema';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant/error.constant';
import { CreateAddressDto } from '../profile/dto/create-address-dto';
import { deleteInvalidValue, pagination } from 'src/common/utils';
import { UpdateAddressDto } from 'src/profile/dto';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from '../profile/dto/update-user-dto';
import { DeleteUserDto } from '../profile/dto/delete-user-dto';
import { USER_FOLDER } from 'src/common/constant';
import { StorageService } from '../storage/storage.service';
import { favoriteFoodProjection, getCommentProjection, getUsersProjecton } from 'src/common/projection';
import { AdminUserService } from 'src/admin/admin-user/admin-user.service';
import { Roles } from 'src/common/enums';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly storageService: StorageService,
        @Inject(forwardRef(() => AdminUserService))
        private readonly adminUserService: AdminUserService
    ) { }

    async createUser(
        createUser: CreateUserDto,
    ): Promise<void> {
        const blackListPhones = await this.adminUserService.getAllBlacklist();
        if (blackListPhones.includes(createUser.phone)) {
            throw new HttpException(
                "متاسفانه این شماره امکان ثبت نام ندارد",
                HttpStatus.BAD_REQUEST
            )
        }
        deleteInvalidValue(createUser);
        const userData = {
            _id: new Types.ObjectId(),
            username: this.generateUsername(createUser.phone),
            ...createUser
        }
        const createResult = await this.userRepository.create(userData);
        if (!createResult) {
            throw new HttpException(
                INTERNAL_SERVER_ERROR_MESSAGE,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateUser(
        updateUserDto: UpdateUserDto,
        phone: string
    ): Promise<void> {
        deleteInvalidValue(updateUserDto);
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: updateUserDto
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteUser(
        deleteUserDto: DeleteUserDto
    ): Promise<void> {
        try {
            await this.userRepository.deleteOne(
                deleteUserDto
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async createAddress(
        phone: string,
        createAddressDto: CreateAddressDto
    ): Promise<void> {
        deleteInvalidValue(createAddressDto);
        const addressData = {
            _id: new Types.ObjectId(),
            ...createAddressDto
        }
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $push: {
                        address: addressData
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateAddress(
        addressId: string,
        updateAddressDto: UpdateAddressDto,
    ): Promise<void> {
        deleteInvalidValue(updateAddressDto);
        try {
            const updateData = {
                _id: new Types.ObjectId(addressId),
                ...updateAddressDto
            }
            await this.userRepository.findOneAndUpdate(
                { "address._id": new ObjectId(addressId) },
                {
                    $set: {
                        "address.$": updateData
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteAddress(
        addressId: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { "address._id": new ObjectId(addressId) },
                {
                    $pull: {
                        "address": { _id: new ObjectId(addressId) }
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateComment(
        userId: string,
        commentId: ObjectId
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $push: {
                        comments: commentId
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find({});
        return users;
    }

    async getAddress(
        phone: string,
        page: number,
        limit: number
    ): Promise<[number, any]> {
        const { address } = await this.userRepository.findOne(
            { phone },
            {
                address: 1,
                _id: false
            }
        );
        const maxPage = Math.ceil(address.length / limit)
        const newAddress = pagination(
            address,
            limit,
            page
        )
        return [
            maxPage,
            newAddress
        ];
    }

    async haveAccount(
        phone: string
    ): Promise<boolean> {
        const user = await this.findUser(phone);
        return user ? true : false;
    }

    private generateUsername(
        phone: string
    ): string {
        const phoneSlice: string = phone.slice(6, 11);
        const username: string = ('user' + phoneSlice);
        return username;
    }

    async saveOtp(
        phone: string,
        code: number,
        expireIn: number
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        "otp.code": code,
                        "otp.expireIn": expireIn
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async saveRefreshToken(
        phone: string,
        refreshToken: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        hashRT: refreshToken
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteComment(
        commentId: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                {
                    comments: {
                        $in: new mongoose.Types.ObjectId(commentId)
                    }
                },
                {
                    $pull: {
                        ['comments']: new mongoose.Types.ObjectId(commentId)
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getComments(
        userId: string
    ): Promise<object> {
        try {
            const [comments] = await this.userRepository.aggregate([
                {
                    $match: {
                        '_id': new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'comments',
                        foreignField: '_id',
                        as: 'comments'
                    },
                },
                {
                    $project: getCommentProjection
                }
            ])
            return comments;
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async removeRefreshToken(
        phone: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        hashRT: null
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async checkUsernameExists(
        username: string,
        phone: string
    ): Promise<void> {
        const isDuplicateUsername = await this.userRepository.findOne({
            phone: { $ne: phone },
            username
        })
        if (isDuplicateUsername) {
            throw new HttpException(
                "این نام کاربری قبلا مورد استفاده قرار گرفته است",
                HttpStatus.CONFLICT
            )
        }
    }

    async findUser(
        phone: string,
        projection: {} = undefined
    ): Promise<User> {
        const user = await this.userRepository.findOne(
            { phone },
            projection
        );
        return user;
    }

    async findUserById(
        userId: string,
        projection: {} = undefined
    ): Promise<User> {
        const user = await this.userRepository.findOne(
            {
                _id: new Types.ObjectId(userId)
            },
            projection
        );
        if (user?.image) {
            const imageUrl = this.storageService.getFileLink(
                user.image,
                USER_FOLDER
            )
            user.imageUrl = imageUrl;
        }
        return user;
    }

    async updateImage(
        phone: string,
        image: string,
        imageUrl: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        image,
                        imageUrl
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateUserPhone(
        lastPhone: string,
        newPhone: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone: lastPhone },
                {
                    $set: {
                        phone: newPhone
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteImage(
        phone: string,
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        image: null,
                        imageUrl: null
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async addFavoriteFood(
        phone: string,
        foodId: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $push: {
                        favoriteFood: new Types.ObjectId(foodId)
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async removeFavoriteFood(
        phone: string,
        foodId: string
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $pull: {
                        favoriteFood: new Types.ObjectId(foodId)
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getFavoriteFoodId(
        phone: string = null
    ): Promise<ObjectId[]> {
        try {
            const user = await this.userRepository.findOne(
                { phone },
                favoriteFoodProjection
            )
            return user ? user.favoriteFood : []
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getUsers(): Promise<User[]> {
        try {
            const users = await this.userRepository.find(
                {},
                getUsersProjecton
            );
            return users
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findByRegex(
        query: string,
    ): Promise<User[]> {
        try {
            const regexPattern = `[a-zA-Z]*${query}[a-zA-Z]*`;
            const user = await this.userRepository.find(
                {
                    $or: [
                        {
                            phone: {
                                $regex: regexPattern
                            }
                        },
                        {
                            username: {
                                $regex: regexPattern
                            }
                        },
                        {
                            name: {
                                $regex: regexPattern
                            }
                        },
                        {
                            family: {
                                $regex: regexPattern
                            }
                        },
                        {
                            email: {
                                $regex: regexPattern
                            }
                        }
                    ]
                },
                getUsersProjecton
            )
            if (!user) {
                throw new HttpException(
                    ("کاربری با این شماره تلفن یافت نشد"),
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            return user
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async giveAdminAccess(
        phone: string
    ): Promise<void> {
        try {
            const updateResult = await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        role: Roles.admin
                    }
                }
            )
            if (!updateResult) {
                throw new HttpException(
                    ("کاربری با این شماره تلفن یافت نشد"),
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async giveUserAccess(
        phone: string
    ): Promise<void> {
        try {
            const updateResult = await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        role: Roles.user
                    }
                }
            )
            if (!updateResult) {
                throw new HttpException(
                    ("کاربری با این شماره تلفن یافت نشد"),
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async addToCart(
        phone: string,
        foodId: string,
        foodPrice: number
    ): Promise<void> {
        try {
            const checkFoodExistsInCarts = await this.checkFoodExistsInCarts(
                phone,
                foodId
            )
            if (checkFoodExistsInCarts) {
                await this.userRepository.findOneAndUpdate(
                    {
                        "carts.foodDetail": {
                            $elemMatch: {
                                foodId: new Types.ObjectId(foodId)
                            }
                        }
                    },
                    {
                        $inc: {
                            'carts.foodDetail.$.quantity': 1,
                            "carts.totalPayment": foodPrice
                        }
                    }
                )
            } else {
                const foodDetail = {
                    foodId: new Types.ObjectId(foodId),
                    quantity: 1
                }
                await this.userRepository.findOneAndUpdate(
                    { phone },
                    {
                        $inc: {
                            "carts.totalPayment": foodPrice
                        },
                        $push: {
                            "carts.foodDetail": foodDetail
                        }
                    }
                )
            }
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async checkFoodExistsInCarts(
        phone: string,
        foodId: string,
    ): Promise<boolean> {
        try {
            const { carts } = await this.userRepository.findOne({
                phone
            })
            const foodsId = carts?.foodDetail?.map(food => {
                return food?.foodId?.toString()
            })
            return foodsId?.includes(foodId) ? true : false;
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async removeFromCart(
        phone: string,
        foodId: string,
        foodPrice: number
    ): Promise<void> {
        try {
            const user = await this.userRepository.findOneAndUpdate(
                {
                    "carts.foodDetail": {
                        $elemMatch: {
                            foodId: new mongoose.Types.ObjectId(foodId)
                        }
                    }
                },
                {
                    $pull: {
                        "carts.foodDetail": {
                            foodId: new mongoose.Types.ObjectId(foodId)
                        }
                    },
                    $inc: {
                        "carts.totalPayment": -foodPrice
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async incrementFood(
        phone: string,
        foodId: string,
        foodPrice: number
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                {
                    "carts.foodDetail": {
                        $elemMatch: {
                            foodId: new Types.ObjectId(foodId)
                        }
                    }
                },
                {
                    $inc: {
                        'carts.foodDetail.$.quantity': 1,
                        "carts.totalPayment": foodPrice
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async decrementFood(
        phone: string,
        foodId: string,
        foodPrice: number
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                {
                    "carts.foodDetail": {
                        $elemMatch: {
                            foodId: new Types.ObjectId(foodId)
                        }
                    }
                },
                {
                    $inc: {
                        'carts.foodDetail.$.quantity': -1,
                        "carts.totalPayment": -foodPrice
                    }
                }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

}

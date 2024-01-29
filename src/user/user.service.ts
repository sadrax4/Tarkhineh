import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { favoriteFoodProjection, getCommentProjection } from 'src/common/projection';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly storageService: StorageService
    ) { }

    async createUser(
        createUser: CreateUserDto,
    ): Promise<void> {
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
        const phoneSlice: string = phone.slice(7, 11);
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

    async deleteImage(
        phone: string,
    ): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                {
                    $set: {
                        image: null
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

    async getFavoriteFood(
        phone: string
    ): Promise<User[]> {
        try {
            return await this.userRepository.aggregate([
                {
                    $match: {
                        phone
                    }
                },
                {
                    $lookup: {
                        from: "foods",
                        localField: "favoriteFood",
                        foreignField: "_id",
                        as: "favoriteFood"
                    }
                },
                {
                    $project: favoriteFoodProjection
                }
            ])
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getFavoriteFoodId(
        phone: string
    ): Promise<ObjectId[]> {
        try {
            const { favoriteFood } = await this.userRepository.findOne(
                { phone },
                favoriteFoodProjection
            )
            return favoriteFood
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}



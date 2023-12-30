import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from '../user/db/user.repository';
import mongoose, { Types } from 'mongoose';
import { User } from './db/user.schema';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant/error.constant';
import { CreateAddressDto } from '../profile/dto/create-address-dto';
import { deleteInvalidValue } from 'src/common/utils';
import { UpdateAddressDto } from 'src/profile/dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
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
                INTERNAL_SERVER_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR
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

    async deleteAddress(addressId: string): Promise<void> {
        try {
            const user = await this.userRepository.findOneAndUpdate(
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

    async findAllUsers() {
        const users = await this.userRepository.find({});
        return users;
    }

    async getAddress(phone: string) {
        const { address } = await this.userRepository.findOne(
            { phone },
            { address: 1, _id: false }
        );
        return address;
    }

    async findUser(phone: string, projection: {} = undefined): Promise<User> {
        const user = await this.userRepository.findOne({ phone }, projection);
        return user;
    }

    async haveAccount(phone: string): Promise<boolean> {
        const user = await this.findUser(phone);
        if (!user) {
            return false;
        }
        return true;
    }

    private generateUsername(phone: string): string {
        const phoneSlice: string = phone.slice(7, 11);
        const username: string = ('user' + phoneSlice);
        return username;
    }

    async saveOtp(phone: string, code: number, expireIn: number): Promise<void> {
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

    async saveRefreshToken(phone: string, refreshToken: string): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                { $set: { hashRT: refreshToken } }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async removeRefreshToken(phone: string): Promise<void> {
        try {
            await this.userRepository.findOneAndUpdate(
                { phone },
                { $set: { hashRT: null } }
            )
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }


}

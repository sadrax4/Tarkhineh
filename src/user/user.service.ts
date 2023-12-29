import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from '../user/db/user.repository';
import { Types } from 'mongoose';
import { User } from './db/user.schema';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant/error.constant';
import { CreateAddressDto } from '../profile/dto/create-address-dto';
import { Response } from 'express';
import { deleteInvalidValue } from 'src/common/utils';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async createUser(
        createUser: CreateUserDto,
    ): Promise<void> {
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
        response: Response,
        createAddressDto: CreateAddressDto
    ): Promise<Response> {
        deleteInvalidValue(createAddressDto);
        console.log(createAddressDto)
        if (createAddressDto.ownReceiver) {
            await this.userRepository.findOneAndUpdate(
                { phone: createAddressDto.phone },
                {
                    $set: {
                        "address.ownReceiver": createAddressDto?.ownReceiver,
                        "address.addressTitle": createAddressDto?.addressTitle,
                        "address.description": createAddressDto?.description,
                    }
                })
        } else {
            await this.userRepository.findOneAndUpdate(
                { phone: createAddressDto.phone },
                {
                    $set: {
                        "address.ownReceiver": createAddressDto?.ownReceiver,
                        "address.addressTitle": createAddressDto?.addressTitle,
                        "address.description": createAddressDto?.description,
                        "address.anotherReceiver.addressTitle": createAddressDto?.anotherReceiver.addressTitle,
                        "address.anotherReceiver.phone": createAddressDto?.anotherReceiver.phone,
                        "address.anotherReceiver.name": createAddressDto?.anotherReceiver.name,
                        "address.anotherReceiver.description": createAddressDto?.anotherReceiver.description,
                    }
                }
            )
        }
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "ادرس با موفقیت ثبت شد",
                statusCode: HttpStatus.CREATED
            })
    }
    
    async updateAddress() {

    }

    async findUser(phone: string): Promise<User> {
        const user = await this.userRepository.findOne({ phone });
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from '../user/db/user.repository';
import { Types } from 'mongoose';
import { User } from './db/user.schema';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/constant/error.constant';

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
            throw new HttpException(INTERNAL_SERVER_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)
        }
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

    async saveOtp(phone: string, code: number, expireIn: number) {
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

}

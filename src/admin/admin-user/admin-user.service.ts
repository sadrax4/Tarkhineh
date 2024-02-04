import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { BlackListRepository } from './db/blackLIst.repository';
import { Response } from 'express';
import { BlackListDto, FindUserDto } from './dto';
import { DeleteUserDto } from 'src/profile/dto';
import { INTERNAL_SERVER_ERROR_MESSAGE } from 'src/common/constant';
import { User } from 'src/user/db/user.schema';
import { getUsersProjecton } from 'src/common/projection';

@Injectable()
export class AdminUserService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private blackListRepository: BlackListRepository
    ) { }

    async getUsers(
        response: Response
    ): Promise<Response> {
        const users = await this.userService.getUsers();
        return response
            .status(HttpStatus.OK)
            .json({
                users,
                statusCode: HttpStatus.OK
            })
    }

    async findUser(
        findUserDto: FindUserDto,
        response: Response
    ): Promise<Response> {
        const user = await this.userService.findByRegex(
            findUserDto.query
        );
        return response
            .status(HttpStatus.OK)
            .json({
                user,
                statusCode: HttpStatus.OK
            })
    }

    async deleteUser(
        delteUserDto: DeleteUserDto,
        response: Response
    ): Promise<Response> {
        await this.userService.deleteUser(
            delteUserDto
        );
        return response
            .status(HttpStatus.OK)
            .json({
                message: "کاربر با موفقیت حذف شد",
                statusCode: HttpStatus.OK
            })
    }

    async addPhoneToBlacklist(
        blackListDto: BlackListDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.blackListRepository.findOneAndUpdate(
                {},
                {
                    $push: {
                        phones: blackListDto.phone
                    }
                }
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "شماره به لیست سیاه اضافه شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async removePhoneFromBlacklist(
        blackListDto: BlackListDto,
        response: Response
    ) {
        try {
            await this.blackListRepository.findOneAndUpdate(
                {},
                {
                    $pull: {
                        phones: blackListDto.phone
                    }
                }
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "شماره از لیست سیاه حذف  شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getBlacklistPhones(
        response: Response
    ): Promise<Response> {
        try {
            const phones = await this.getAllBlacklist()
            return response
                .status(HttpStatus.OK)
                .json({
                    phones,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getAllBlacklist(): Promise<string[]> {
        try {
            const { phones } = await this.blackListRepository.findOne({})
            return phones
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findUserById(
        userId: string,
        response: Response
    ): Promise<Response> {
        try {
            const user = await this.userService.findUserById(
                userId,
                getUsersProjecton
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    user,
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            throw new HttpException(
                (INTERNAL_SERVER_ERROR_MESSAGE + error),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

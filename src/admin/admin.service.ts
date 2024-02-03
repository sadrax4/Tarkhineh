import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import {  FindUserDto } from './dto';
import { getUsersProjecton } from 'src/common/projection';
import { DeleteUserDto } from 'src/profile/dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly userService: UserService
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
}

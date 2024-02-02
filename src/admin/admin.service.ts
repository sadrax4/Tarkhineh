import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { FindUserDto } from './dto';
import { getUsersProjecton } from 'src/common/projection';

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
            findUserDto.phone,
            getUsersProjecton
        );
        return response
            .status(HttpStatus.OK)
            .json({
                user,
                statusCode: HttpStatus.OK
            })
    }
}

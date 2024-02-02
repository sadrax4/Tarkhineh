import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly userService: UserService
    ) { }

    async getUsers(
        response: Response
    ) {
        const users = await this.userService.getUsers();
        return response
            .status(HttpStatus.OK)
            .json({
                users,
                statusCode: HttpStatus.OK
            })
    }
}

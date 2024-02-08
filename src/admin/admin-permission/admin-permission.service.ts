import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GiveAccessDto } from './dto/giveAccess.dto';
import { Response } from 'express';

@Injectable()
export class AdminPermissionService {
    constructor(
        private readonly userService: UserService
    ) { }

    async giveAdminAccess(
        giveAccessDto: GiveAccessDto,
        response: Response
    ): Promise<Response> {
        await this.userService.giveAdminAccess(
            giveAccessDto.phone
        )
        return response
            .status(HttpStatus.OK)
            .json({
                message: "دسترسی ادمین به کاربر داده شد",
                statusCode: HttpStatus.OK
            })
    }

    async giveUserAccess(
        giveAccessDto: GiveAccessDto,
        response: Response
    ): Promise<Response> {
        await this.userService.giveUserAccess(
            giveAccessDto.phone
        )
        return response
            .status(HttpStatus.OK)
            .json({
                message: "دسترسی عادی به کاربر داده شد",
                statusCode: HttpStatus.OK
            })
    }
}

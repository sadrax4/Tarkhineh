import { HttpStatus, Injectable, forwardRef, Inject, HttpException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GiveAccessDto } from './dto/giveAccess.dto';
import { Response } from 'express';

@Injectable()
export class AdminPermissionService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) { }

    async giveAdminAccess(
        giveAccessDto: GiveAccessDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.giveAdminAccess(
                giveAccessDto.phone
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "دسترسی ادمین به کاربر داده شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async giveUserAccess(
        giveAccessDto: GiveAccessDto,
        response: Response
    ): Promise<Response> {
        try {
            await this.userService.giveUserAccess(
                giveAccessDto.phone
            )
            return response
                .status(HttpStatus.OK)
                .json({
                    message: "دسترسی عادی به کاربر داده شد",
                    statusCode: HttpStatus.OK
                })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    (error),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}

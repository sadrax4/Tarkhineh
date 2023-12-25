import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response
    ) {
        const haveAccount: boolean = await this.userService.haveAccount(loginUserDto.phone);
        if (!haveAccount) {
            await this.userService.createUser(loginUserDto)
        }
        return await this.authService.getOtp(loginUserDto.phone, response);
    }

}

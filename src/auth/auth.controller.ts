import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MIMETYPE } from 'src/constant/mimeType.constant';
import { ResponseMessage } from 'src/constant/api-response';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post('login')
    @ApiBody({ type: LoginUserDto, required: true })
    @ApiTags('auth')
    @ApiConsumes(MIMETYPE.FORM_URL_ENCODED)
    @ApiResponse({ type: ResponseMessage, status: 200 })
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response
    ): Promise<ResponseMessage> {
        const haveAccount: boolean = await this.userService.haveAccount(loginUserDto.phone);
        if (!haveAccount) {
            await this.userService.createUser(loginUserDto)
        }
        return await this.authService.getOtp(loginUserDto.phone, response);
    }
}

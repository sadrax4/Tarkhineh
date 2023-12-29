import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CheckOtpDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiBody, ApiConsumes, ApiProduces, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MIMETYPE } from 'src/common/constant/mimeType.constant';
import { OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';
import { ResendCodeDto } from './dto/resend-code-dto';
import { Token } from './types';
import { JwtGuard, RefreshGuard } from './guards';
import { GetCurrentUser, GetCurrentUserCookies } from './decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post('get-otp')
    @ApiTags('auth')
    @ApiBody({ type: LoginUserDto, required: true })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage
        , status: HttpStatus.OK
    })
    async getOtp(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response
    ): Promise<Response> {
        const haveAccount: boolean = await this.userService.haveAccount(loginUserDto.phone);
        if (!haveAccount) {
            await this.userService.createUser(loginUserDto)
        }
        return this.authService.getOtp(loginUserDto.phone, response);
    }

    @Post('check-otp')
    @ApiTags('auth')
    @ApiBody({ type: CheckOtpDto, required: true })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    async checkOtp(
        @Body() checkOtpDto: CheckOtpDto,
        @Res() response: Response
    ) {
        console.log(typeof checkOtpDto.otpCode)
        return await this.authService.checkOtp(
            checkOtpDto.phone,
            checkOtpDto.otpCode,
            response
        )
    }

    @ApiTags('auth')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({ type: OkResponseMessage, status: HttpStatus.OK })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Post('resend-code')
    async resendCode(
        @Res() response: Response,
        @Body() resendCodeDto: ResendCodeDto
    ) {
        return this.authService.resendCode(response, resendCodeDto);
    }

    @UseGuards(RefreshGuard)
    @ApiTags('auth')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get('refresh')
    async refreshToken(
        @GetCurrentUser("phone") phone: string,
        @GetCurrentUserCookies("refresh-token") refreshToken: string,
        @Req() request: Request,
        @Res() response: Response
    ) {
        return await this.authService.refreshToken(response, refreshToken, phone);
    }

    @UseGuards(JwtGuard)
    @ApiTags('auth')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get('logout')
    async logout(
        @GetCurrentUser("phone") phone: string,
        @Req() request: Request,
        @Res() response: Response
    ) {
        await this.authService.logout(phone, response);
    }

}

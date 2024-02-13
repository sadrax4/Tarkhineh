import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CheckOtpDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MIMETYPE } from 'src/common/constant/mimeType.constant';
import { OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';
import { ResendCodeDto } from './dto/resend-code-dto';
import { JwtGuard, PublicGuard, RefreshGuard } from './guards';
import { GetCurrentUserCookies } from './decorator';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @UseGuards(PublicGuard)
    @Post('get-otp')
    @ApiTags('auth')
    @ApiOperation({ summary: "get otp " })
    @ApiBody({ type: LoginUserDto, required: true })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    async getOtp(
        @Body() loginUserDto: LoginUserDto,
        @GetCurrentUser("phone") phone: string,
        @Res() response: Response
    ): Promise<Response> {
        if (!phone?.startsWith("09") && phone !== null) {
            await this.userService.updateUserPhone(
                phone,
                loginUserDto.phone
            )
        }
        const haveAccount: boolean = await this.userService.haveAccount(
            loginUserDto.phone
        );
        if (!haveAccount) {
            await this.userService.createUser(loginUserDto)
        }
        return this.authService.getOtp(
            loginUserDto.phone,
            response
        );
    }

    @Post('check-otp')
    @ApiTags('auth')
    @ApiOperation({ summary: "check otp " })
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
        @Res() response: Response,
    ): Promise<Response> {
        return this.authService.checkOtp(
            checkOtpDto.phone,
            checkOtpDto.otpCode,
            response
        )
    }

    @ApiTags('auth')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiOperation({ summary: "resend otp code " })
    @ApiResponse({ type: OkResponseMessage, status: HttpStatus.OK })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Post('resend-code')
    async resendCode(
        @Res() response: Response,
        @Body() resendCodeDto: ResendCodeDto
    ): Promise<Response> {
        return this.authService.resendCode(response, resendCodeDto);
    }

    @UseGuards(RefreshGuard)
    @ApiTags('auth')
    @ApiOperation({ summary: "generate new refresh & access token " })
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
    ): Promise<Response | void> {
        return await this.authService.refreshToken(
            response,
            refreshToken,
            phone);
    }

    @UseGuards(JwtGuard)
    @ApiTags('auth')
    @ApiOperation({ summary: "log out user " })
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
        @Res() response: Response
    ) {
        await this.authService.logout(phone, response);
    }

}

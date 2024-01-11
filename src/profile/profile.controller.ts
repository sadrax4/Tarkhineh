import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards
} from '@nestjs/common';
import {
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
    MIMETYPE,
    OkResponseMessage,
    UnAuthorizeResponseMessage
} from 'src/common/constant';
import {
    CreateAddressDto,
    DeleteUserDto,
    UpdateAddressDto,
    UpdateUserDto,
    UpdateUserSwagger
} from './dto';
import { JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private configService: ConfigService
    ) { }

    @UseGuards(JwtGuard)
    @ApiBody({
        type: UpdateUserSwagger,
        required: true
    })
    @ApiTags('profile-user')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post('user')
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ) {
        return await this.profileService.updateUser(
            updateUserDto,
            phone,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiBody({
        type: DeleteUserDto,
        required: true
    })
    @ApiTags('profile-user')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete('user')
    async deleteUser(
        @Body() deleteUserDto: DeleteUserDto,
        @Res() response: Response
    ) {
        return await this.profileService.deleteUser(
            deleteUserDto,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiBody({
        type: CreateAddressDto,
        required: true
    })
    @ApiTags('profile-address')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post('address')
    async createAddress(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response,
        @Body() createAddressDto: CreateAddressDto
    ): Promise<Response> {
        return await this.profileService.createAddress(
            phone,
            createAddressDto,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiBody({
        type: UpdateAddressDto,
        required: true
    })
    @ApiTags('profile-address')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Patch('address/:id')
    async updateAddress(
        @Res() response: Response,
        @Body() updateAddressDto: UpdateAddressDto,
        @Param('id') addressId: string
    ): Promise<Response> {
        return await this.profileService.updateAddress(
            addressId,
            response,
            updateAddressDto,
        );
    }

    @UseGuards(JwtGuard)
    @ApiTags('profile-address')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Delete('address/:id')
    async deleteAddress(
        @Res() response: Response,
        @Param('id') addressId: string
    ): Promise<Response> {
        return await this.profileService.deleteAddress(
            addressId,
            response,
        );
    }

    @UseGuards(JwtGuard)
    @ApiTags('profile-address')
    @ApiQuery({
        name: 'page', required: false
    })
    @ApiQuery({
        name: 'limit', required: false
    })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Get('address')
    async getAddress(
        @GetCurrentUser('phone') phone: string,
        @GetCurrentUser('username') username: string,
        @Res() response: Response,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<Response> {
        return await this.profileService.getAddress(
            phone,
            username,
            page ? page : this.configService.get<number>("PAGE"),
            limit ? limit : this.configService.get<number>("LIMIT"),
            response
        );
    }

}

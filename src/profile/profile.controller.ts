import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage, UnAuthorizeResponseMessage } from '@app/common';
import { CreateAddressDto, DeleteUserDto, UpdateAddressDto, UpdateImageDto, UpdateUserDto, UpdateUserSwagger } from './dto';
import { AdminGuard, JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from '@app/common';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UploadFileAws } from '@app/common';


@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private configService: ConfigService
    ) { }


    @UseGuards(JwtGuard)
    @ApiOperation({ summary: " user orders " })
    @ApiTags('profile-order')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('orders')
    async getUserOrders(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ): Promise<Response> {
        return await this.profileService.getUserOrders(
            phone,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "update user profile " })
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
    ): Promise<Response> {
        return await this.profileService.updateUser(
            updateUserDto,
            phone,
            response
        );
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "delete user " })
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
    ): Promise<Response> {
        return await this.profileService.deleteUser(
            deleteUserDto,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "create user address " })
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
    @ApiOperation({ summary: "update user address by address-id " })
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
    @ApiOperation({ summary: "delete user address by address-id " })
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
    @ApiOperation({ summary: "get all user addresses " })
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

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "update user image " })
    @ApiBody({
        type: UpdateImageDto,
        required: true
    })
    @ApiTags('profile-user')
    @ApiConsumes(MIMETYPE.MULTIPART)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Patch('image')
    @UseInterceptors(UploadFileAws('image'))
    async updateImage(
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ) {
        return await this.profileService.updateImage(
            phone,
            file,
            response
        )
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "delete user image " })
    @ApiTags('profile-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete('image')
    async deleteImage(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response
    ) {
        return await this.profileService.deleteImage(
            phone,
            response
        )
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "add food to favorite food  " })
    @ApiTags('profile-user')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post('favorite-food')
    async addFavoriteFood(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response,
        @Query("foodId") foodId: string
    ): Promise<Response> {
        return this.profileService.addFavoriteFood(
            phone,
            foodId,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "delete food from favorite food " })
    @ApiTags('profile-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Delete('favorite-food')
    async removeFavoriteFood(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response,
        @Query("foodId") foodId: string
    ): Promise<Response> {
        return this.profileService.removeFavoriteFood(
            phone,
            foodId,
            response
        );
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: "get all user favorite food " })
    @ApiQuery({ name: "main", required: false })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @ApiQuery({ name: "q", required: false })
    @ApiTags('profile-user')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('favorite-food')
    async getFavoriteFood(
        @GetCurrentUser('phone') phone: string,
        @Query('main') mainCategory: string = null,
        @Query('page') page: number = null,
        @Query('limit') limit: number = null,
        @Query('q') query: string = null,
        @Res() response: Response
    ): Promise<Response> {
        return this.profileService.getFavoriteFood(
            phone,
            mainCategory,
            page ? page : this.configService.get<number>("PAGE"),
            limit ? limit : this.configService.get<number>("LIMIT"),
            query,
            response
        );
    }
}



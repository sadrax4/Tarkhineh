import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { ProfileService } from './profile.service';
import { Response } from 'express';

@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService
    ) { }

    @UseGuards(JwtGuard)
    @ApiBody({ type: CreateAddressDto, required: true })
    @ApiTags('profile')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({ type: OkResponseMessage, status: 201 })
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
    @ApiBody({ type: UpdateAddressDto, required: true })
    @ApiTags('profile')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({ type: OkResponseMessage, status: 200 })
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
    @ApiTags('profile')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({ type: OkResponseMessage, status: 200 })
    @Delete('address/:id')
    async deleteAddress(
        @Res() response: Response,
        @Param('id') addressId: string
    ) {
        return await this.profileService.deleteAddress(
            addressId,
            response,
        );
    }

    @UseGuards(JwtGuard)
    @ApiTags('profile')
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({ type: OkResponseMessage, status: 200 })
    @Get('address')
    async getAddress(
        @GetCurrentUser('phone') phone: string,
        @Res() response: Response,
    ) {
        await this.profileService.getAddress(
            phone,
            response
        );
    }

}

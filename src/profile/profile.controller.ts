import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MIMETYPE, OkResponseMessage } from 'src/common/constant';
import { CreateAddressDto } from './dto';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { ProfileService } from './profile.service';

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
        @Body() createAddress: CreateAddressDto
    ) {
        return await this.profileService.createAddress(phone, createAddress, response);
    }

    @Patch('address')
    async updateAddress() {
     //   return await this.profileAddress.updateAddress();
    }
}

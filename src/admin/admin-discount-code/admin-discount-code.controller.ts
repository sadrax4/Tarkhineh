import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guards';
import { MIMETYPE, OkResponseMessage, UnAuthorizeResponseMessage } from 'src/common/constant';
import { AdminDiscountCodeService } from './admin-discount-code.service';
import { GenerateDiscountCodeDto } from './dto';

@Controller('admin')
export class AdminDiscountCodeController {
    constructor(
        private adminDiscountCodeService: AdminDiscountCodeService
    ) { }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: " get discount code " })
    @ApiTags('admin-dicount-code')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("dicount-code")
    async getDiscountCodes(
        @Res() response: Response,
    ) {
        return this.adminDiscountCodeService.getDiscountCodes(
            response
        )
    }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: " generate discount code " })
    @ApiBody({ type: GenerateDiscountCodeDto })
    @ApiTags('admin-dicount-code')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @ApiConsumes(MIMETYPE.JSON)
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.CREATED
    })
    @Post("dicount-code")
    async generate(
        @Body() generateDicountCodeDto: GenerateDiscountCodeDto,
        @Res() response: Response,
    ) {
        return this.adminDiscountCodeService.generate(
            generateDicountCodeDto,
            response
        )
    }
}

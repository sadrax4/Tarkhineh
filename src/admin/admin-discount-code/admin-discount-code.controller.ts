import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guards';
import { UnAuthorizeResponseMessage } from 'src/common/constant';
import { GetCurrentUser } from 'src/common/decorators';
import { AdminDiscountCodeService } from './admin-discount-code.service';
import { GenerateDiscountCode } from './dto';

@Controller('admin')
export class AdminDiscountCodeController {
    constructor(
        private adminDiscountCodeService: AdminDiscountCodeService
    ) { }

    @UseGuards(AdminGuard)
    @ApiOperation({ summary: "discount code " })
    @ApiBody({ type: GenerateDiscountCode })
    @ApiTags('admin-dicount-code')
    @ApiUnauthorizedResponse({
        type: UnAuthorizeResponseMessage,
        status: HttpStatus.UNAUTHORIZED
    })
    @Post("dicount-code")
    async generate(
        @Body() generateDicountCode: GenerateDiscountCode,
        @Res() response: Response,
        @GetCurrentUser("phone") phone: string
    ) {
        return this.adminDiscountCodeService.generate(
            generateDicountCode,
            response
        )
    }
}

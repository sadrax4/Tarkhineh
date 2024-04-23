import { Body, Controller } from '@nestjs/common';
import { OkResponseMessage } from '@app/common';
import { Get, HttpStatus, Injectable, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { HomeService } from './home.service';
import { Response } from 'express';
import { SearchDto } from './dto';
@Controller('home')
export class HomeController {
    constructor(
        private homeService: HomeService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: " search in the home " })
    @ApiTags('home')
    @ApiBody({ type: SearchDto })
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Post('search')
    async search(
        @Body() searchDto: SearchDto,
        @Res() response: Response
    ): Promise<Response> {
        return await this.homeService.search(
            searchDto,
            response
        );
    }
}

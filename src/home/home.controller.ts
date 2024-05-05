import { Body, Controller, Query } from '@nestjs/common';
import { OkResponseMessage } from '@app/common';
import { Get, HttpStatus, Injectable, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { HomeService } from './home.service';
import { Response } from 'express';
@Controller('home')
export class HomeController {
    constructor(
        private homeService: HomeService
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: " search in the home " })
    @ApiTags('home')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get('search')
    async search(
        @Query("search") search: string,
        @Res() response: Response
    ): Promise<Response> {
        return await this.homeService.search(
            search,
            response
        );
    }
}

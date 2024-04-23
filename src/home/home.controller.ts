import { Controller } from '@nestjs/common';
import { OkResponseMessage } from '@app/common';
import { Get, HttpStatus, Injectable, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { HomeService } from './home.service';
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
      @Post('search')
      async search(
        @Res() response: Response
      ): Promise<Response> {
        return await this.homeService.search(
          response
        );
      }
}

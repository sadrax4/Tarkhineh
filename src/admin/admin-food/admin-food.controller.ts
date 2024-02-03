import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AdminFoodService } from './admin-food.service';
import { OkResponseMessage } from 'src/common/constant';
import { JwtGuard } from 'src/auth/guards';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('admin')
export class AdminFoodController {
    constructor(
        private adminFoodService: AdminFoodService
    ) { }

    @UseGuards(JwtGuard)
    @ApiTags('admin-food')
    @ApiResponse({
        type: OkResponseMessage,
        status: HttpStatus.OK
    })
    @Get("foods")
    async getFood(
        @Res() response: Response
    ): Promise<Response> {
        return this.adminFoodService.getFoods(
            response
        );
    }
}

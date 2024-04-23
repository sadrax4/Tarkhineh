import { OkResponseMessage } from '@app/common';
import { Get, HttpStatus, Injectable, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';

@Injectable()
export class HomeService {
  
}

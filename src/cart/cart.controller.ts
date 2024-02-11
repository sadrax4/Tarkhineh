import { Controller, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { UnAuthorizeResponseMessage } from 'src/common/constant';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) { }

    // @UseGuards(JwtGuard)
    // @ApiOperation({ summary: "get all user information " })
    // @ApiTags('user')
    // @ApiUnauthorizedResponse({
    //     type: UnAuthorizeResponseMessage,
    //     status: HttpStatus.UNAUTHORIZED
    // })
    // @Get()
    // async getUser(
    //     @Res() response: Response,
    //     @Req() request: Request,
    //     @GetCurrentUser('phone') phone: string,
    // ) {
    //     const projection = {
    //         hashRT: 0,
    //         otp: 0
    //     };
    //     let user: any = await this.userService.findUser(phone, projection);
    //     return response
    //         .status(HttpStatus.OK)
    //         .json({
    //             data: user,
    //             statusCode: HttpStatus.OK
    //         })
    // }
}

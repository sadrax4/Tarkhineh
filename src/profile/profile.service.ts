import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateAddressDto } from './dto';

@Injectable()
export class ProfileService {
    constructor(
        private userService: UserService
    ) { }
    async createAddress(
        phone: string,
        createAddress: CreateAddressDto,
        response: Response
    ) {

    }
}

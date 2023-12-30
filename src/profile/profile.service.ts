import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { Response } from 'express';

@Injectable()
export class ProfileService {
    constructor(
        private userService: UserService
    ) { }

    async createAddress(
        phone: string,
        createAddressDto: CreateAddressDto,
        response: Response
    ): Promise<Response> {
        await this.userService.createAddress(
            phone,
            createAddressDto
        );
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "ادرس با موفقیت ثبت شد",
                statusCode: HttpStatus.CREATED
            })
    }

    async updateAddress(
        addressId: string,
        response: Response,
        updateAddressDto: UpdateAddressDto,
    ): Promise<Response> {
        await this.userService.updateAddress(
            addressId,
            updateAddressDto,
        );
        return response
            .status(HttpStatus.OK)
            .json({
                message: "ادرس با موفقیت به روز  شد",
                statusCode: HttpStatus.OK
            })
    }

    async deleteAddress(
        addressId: string,
        response: Response
    ) {
        await this.userService.deleteAddress(addressId);
    }

    async getAddress(
        phone: string,
        response: Response
    ) {
        const userAddress = await this.userService.getAddress(phone);
        console.log(userAddress);
        return { userAddress }
    }
}

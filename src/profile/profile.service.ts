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
        return response
            .status(HttpStatus.OK)
            .json({
                message: "ادرس با موفقیت حذف  شد",
                statusCode: HttpStatus.OK
            })
    }

    async getAddress(
        phone: string,
        username: string,
        response: Response
    ): Promise<Response> {
        const userAddresses = await this.userService.getAddress(phone);
        const addresses = userAddresses.map(
            (address) => {
                if (!address.ownReceiver) {
                    let {
                        addressTitle,
                        description,
                        phone,
                        name
                    } = address.anotherReceiver;
                    return {
                        _id: address._id,
                        addressTitle,
                        description,
                        phone, name,
                        ownReceiver: address.ownReceiver
                    }
                } else {
                    const {
                        addressTitle,
                        description,
                        ownReceiver,
                        _id,
                    } = address
                    return {
                        _id,
                        phone,
                        name: username,
                        addressTitle,
                        description,
                        ownReceiver
                    }
                }
            })
        return response
            .status(HttpStatus.OK)
            .json({
                data: addresses
            })
    }
}

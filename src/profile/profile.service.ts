import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
    CreateAddressDto,
    DeleteUserDto,
    UpdateAddressDto,
    UpdateUserDto
} from './dto';
import { Response } from 'express';
import { deleteInvalidValue } from 'src/common/utils';

@Injectable()
export class ProfileService {
    constructor(
        private userService: UserService
    ) { }

    async updateUser(
        updateUserDto: UpdateUserDto,
        phone: string,
        response: Response
    ): Promise<Response> {
        await this.userService.checkUsernameExists(
            updateUserDto.username,
            phone
        )
        deleteInvalidValue(updateUserDto);
        await this.userService.updateUser(
            updateUserDto,
            phone
        )
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "کاربر با موفقیت به روز رسانی  شد",
                statusCode: HttpStatus.CREATED
            })
    }

    async deleteUser(
        deleteUserDto: DeleteUserDto,
        response: Response
    ): Promise<Response> {
        await this.userService.deleteUser(deleteUserDto)
        return response
            .status(HttpStatus.CREATED)
            .json({
                message: "کاربر با موفقیت حذف شد",
                statusCode: HttpStatus.CREATED
            })
    }

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
    ): Promise<Response> {
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
        page: number,
        limit: number,
        response: Response
    ): Promise<Response> {
        const [
            maxPage,
            userAddresses
        ] = await this.userService.getAddress(
            phone,
            page,
            limit
        );
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
                    } = address;
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
                data: addresses,
                maxPage
            })
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from '../user/db/user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }
    async createUser(createUser: CreateUserDto) {
        const createResult = await this.userRepository.create(createUser);
        if (!createResult) {
            throw new HttpException("خطای سروری", HttpStatus.INTERNAL_SERVER_ERROR)
        } 
    }
}

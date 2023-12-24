import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './db/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './db/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController]
})
export class UserModule { }

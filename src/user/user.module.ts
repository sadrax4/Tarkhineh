import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './db/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './db/user.schema';
import { StorageService } from 'src/storage/storage.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    StorageModule
  ],
  providers: [
    UserService,
    UserRepository,
    StorageService
  ],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {

}

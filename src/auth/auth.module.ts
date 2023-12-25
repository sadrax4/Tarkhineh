import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/db/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/db/user.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserService]
})

export class AuthModule { }

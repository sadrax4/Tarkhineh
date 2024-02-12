import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/db/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, PublicStrategy, RefreshStrategy } from './strategy';
import { AdminStrategy } from './strategy/admin-strategy';
import { CartStrategy } from './strategy/cart-strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({}),
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshStrategy,
    JwtStrategy,
    PublicStrategy,
    AdminStrategy,
    CartStrategy
  ]
})

export class AuthModule { }

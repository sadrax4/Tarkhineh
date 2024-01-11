import { MiddlewareConsumer, Module, NestModule, RequestMethod, Post } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/db/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/db/user.schema';
import { AddressSwaggerMiddleware } from './middleware/address-swagger-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
    ProfileController
  ],
  providers: [
    ProfileService,
    UserService,
    JwtService,
    UserRepository
  ]
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddressSwaggerMiddleware)
      .forRoutes(
        'profile/address'
      );
  }
}

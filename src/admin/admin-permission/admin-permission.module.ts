import { Module } from '@nestjs/common';
import { AdminPermissionService } from './admin-permission.service';
import { AdminPermissionController } from './admin-permission.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    AdminPermissionService
  ],
  controllers: [
    AdminPermissionController
  ]
})
export class AdminPermissionModule { }

import { Module, forwardRef } from '@nestjs/common';
import { AdminPermissionService } from './admin-permission.service';
import { AdminPermissionController } from './admin-permission.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule)
  ],
  providers: [
    AdminPermissionService
  ],
  controllers: [
    AdminPermissionController
  ],
  exports:[
    AdminPermissionModule
  ]
})
export class AdminPermissionModule { }

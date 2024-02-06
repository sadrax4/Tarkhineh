import { Module } from '@nestjs/common';
import { AdminPermissionService } from './admin-permission.service';
import { AdminPermissionController } from './admin-permission.controller';

@Module({
  providers: [AdminPermissionService],
  controllers: [AdminPermissionController]
})
export class AdminPermissionModule {}

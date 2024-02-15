import { Module } from '@nestjs/common';
import { AdminDiscountCodeService } from './admin-discount-code.service';
import { AdminDiscountCodeController } from './admin-discount-code.controller';

@Module({
  providers: [AdminDiscountCodeService],
  controllers: [AdminDiscountCodeController]
})
export class AdminDiscountCodeModule {}

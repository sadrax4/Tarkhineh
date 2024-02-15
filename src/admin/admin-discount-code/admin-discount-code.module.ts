import { Module } from '@nestjs/common';
import { AdminDiscountCodeService } from './admin-discount-code.service';
import { AdminDiscountCodeController } from './admin-discount-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountCode, DiscountCodeSchema } from './db/discount-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DiscountCode.name,
        schema: DiscountCodeSchema
      },
    ])
  ],
  providers: [AdminDiscountCodeService],
  controllers: [AdminDiscountCodeController]
})
export class AdminDiscountCodeModule { }

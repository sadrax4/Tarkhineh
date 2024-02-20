import { Module } from '@nestjs/common';
import { RepresentationService } from './representation.service';
import { RepresentationController } from './representation.controller';

@Module({
  providers: [RepresentationService],
  controllers: [RepresentationController]
})
export class RepresentationModule {}

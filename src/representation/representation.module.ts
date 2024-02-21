import { Module } from '@nestjs/common';
import { RepresentationService } from './representation.service';
import { RepresentationController } from './representation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Representation, RepresentationSchema } from './db/representation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Representation.name,
        schema: RepresentationSchema
      }
    ])
  ],
  providers: [RepresentationService],
  controllers: [RepresentationController]
})
export class RepresentationModule { }

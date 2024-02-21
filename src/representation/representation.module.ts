import { Module } from '@nestjs/common';
import { RepresentationService } from './representation.service';
import { RepresentationController } from './representation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Representation, RepresentationSchema } from './db/representation.schema';
import { StorageModule } from 'src/storage/storage.module';
import { RepresentationRepository } from './db/representation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Representation.name,
        schema: RepresentationSchema
      }
    ]),
    StorageModule
  ],
  providers: [
    RepresentationService,
    RepresentationRepository
  ],
  controllers: [
    RepresentationController
  ]
})
export class RepresentationModule { }

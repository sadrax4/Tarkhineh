import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './db/category.schema';
import { CategoryRepository } from './db/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])

  ],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController]
})
export class CategoryModule { }

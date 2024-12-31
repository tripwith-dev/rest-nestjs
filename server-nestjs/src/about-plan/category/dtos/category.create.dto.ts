import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class CreateCategoryDto extends PickType(CategoryEntity, [
  'categoryTitle',
] as const) {}

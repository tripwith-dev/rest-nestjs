import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class UpdateCategoryDto extends PickType(CategoryEntity, [
  'categoryTitle',
] as const) {}

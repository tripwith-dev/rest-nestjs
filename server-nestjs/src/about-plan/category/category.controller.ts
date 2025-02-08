import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/category.create.dto';
import { UpdateCategoryDto } from './dtos/category.update.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCategory(
    @Body() createTravelCategoryDto: CreateCategoryDto,
    @Query('avatarId') avatarId: number,
  ) {
    return await this.categoryService.createCategory(
      createTravelCategoryDto,
      avatarId,
    );
  }

  @Get(':categoryId')
  async findCategoryWithPlansByCategoryId(
    @Param('categoryId') categoryId: number,
  ) {
    return await this.categoryService.findCategoryWithPlansByCategoryId(
      categoryId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/update')
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateTravelCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(
      categoryId,
      updateTravelCategoryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/delete')
  async softDeletedCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.softDeletedCategory(categoryId);
  }
}

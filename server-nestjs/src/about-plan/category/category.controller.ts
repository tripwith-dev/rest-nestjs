import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
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
    @Request() req: any,
  ) {
    return await this.categoryService.createCategory(
      createTravelCategoryDto,
      req.user.id,
    );
  }

  @Get(':categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number) {
    return await this.categoryService.findOneTravelCategoryFilteringPrivate(
      categoryId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/update')
  async updateTravelCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateTravelCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateTravelCategory(
      categoryId,
      updateTravelCategoryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/delete')
  async deleteTravelCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.softDeletedTravelCategory(categoryId);
  }
}

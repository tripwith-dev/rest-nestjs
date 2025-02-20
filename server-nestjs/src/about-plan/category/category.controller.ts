import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { OptionalAuthGuard } from 'src/about-user/jwt/jwt.optionalAuthGuard';
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
      req.user.avatar.avatarId,
    );
  }

  @Get(':categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number) {
    return await this.categoryService.findCategoryWithAvatarByCategoryId(
      categoryId,
    );
  }

  @Get(':categoryId/with-plans')
  @UseGuards(OptionalAuthGuard) // 로그인 안해도 조회 가능
  async findCategoryWithPlansByCategoryId(
    @Param('categoryId') categoryId: number,
    @Request() req: any,
  ) {
    const avatarId = req?.user?.avatar?.avatarId;

    const isOwner = await this.categoryService.isCategoryOwner(
      categoryId,
      avatarId,
    );

    return await this.categoryService.findCategoryWithPlansByCategoryId(
      isOwner,
      categoryId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/update')
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateTravelCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.categoryService.isCategoryOwner(
      categoryId,
      avatarId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('해당 카테고리에 접근 권한이 없습니다.');
    }

    return this.categoryService.updateCategory(
      categoryId,
      updateTravelCategoryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/delete')
  async softDeletedCategory(
    @Param('categoryId') categoryId: number,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.categoryService.isCategoryOwner(
      categoryId,
      avatarId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('해당 카테고리에 접근 권한이 없습니다.');
    }

    return this.categoryService.softDeletedCategory(categoryId);
  }
}

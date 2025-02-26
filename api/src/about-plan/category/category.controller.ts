import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { UpdateResult } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/category.create.dto';
import { UpdateCategoryDto } from './dtos/category.update.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 로그인 한 유저는 마이페이지에서 여행 카테고리를 생성할 수 있다.
   * JwtAuthGuard 통해 로그인 여부를 확인한다.
   * @param createTravelCategoryDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: any,
  ): Promise<CategoryEntity> {
    return await this.categoryService.createCategory(
      createCategoryDto,
      req.user.avatar.avatarId,
    );
  }

  /**
   * 특정 카테고리를 조회
   * @param categoryId
   * @returns
   */
  @Get(':categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number) {
    return await this.categoryService.findCategoryById(categoryId);
  }

  /**
   * 특정 카테고리를 조회
   * @param categoryId
   * @returns
   */
  @Get('my/categories')
  @UseGuards(JwtAuthGuard)
  async findCategoriesByAvatarId(
    @Request() req: any,
  ): Promise<CategoryEntity[]> {
    const avatarId = req.user.avatar.avatarId;
    return await this.categoryService.findCategoriesByAvatarId(avatarId);
  }

  /**
   * 카테고리를 수정하는 엔드포인트. 본인의 카테고리만 수정 가능하다.
   * 따라서 JwtAuthGuard와 req를 통해 로그인 여부를 확인해야 한다.
   * @param categoryId
   * @param updateTravelCategoryDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/update')
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateTravelCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.categoryService.isOwner(categoryId, avatarId);

    if (!isOwner) {
      throw new ForbiddenException('카테고리 수정 권한이 없습니다.');
    }

    return this.categoryService.updateCategory(
      categoryId,
      updateTravelCategoryDto,
    );
  }

  /**
   * 카테고리를 삭제하는 엔드포인트. 본인의 카테고리만 삭제 가능하다.
   * 따라서 JwtAuthGuard와 req를 통해 로그인 여부를 확인해야 한다.
   * 카테고리 삭제 시에 해당 카테고리에 속한 여행 계획과 detail, comment도 삭제된다.
   * cascade 설정을 통해 자동으로 삭제할 수도 있지만, soft delete로 구현하기에 일일히 삭제해야 한다.
   * @param categoryId
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId/delete')
  async softDeletedCategory(
    @Param('categoryId') categoryId: number,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.categoryService.isOwner(categoryId, avatarId);

    if (!isOwner) {
      throw new ForbiddenException('카테고리 삭제 권한이 없습니다.');
    }
    return this.categoryService.softDeletedCategory(categoryId);
  }
}

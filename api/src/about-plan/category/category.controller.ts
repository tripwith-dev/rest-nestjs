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
  ) {
    return await this.categoryService.createCategory(
      createCategoryDto,
      req.user.avatar.avatarId,
    );
  }

  /**
   * 특정 카테고리와 카테고리를 생성한 유저를 함께 조회한다.
   * 카테고리 자체는 공개/비공개 상태가 없기에 누구나 조회 가능하다. = 인증이 필요없다.
   * @param categoryId
   * @returns
   */
  @Get(':categoryId')
  async findCategoryWithAvatarByCategoryId(
    @Param('categoryId') categoryId: number,
  ) {
    return await this.categoryService.findCategoryWithAvatarByCategoryId(
      categoryId,
    );
  }

  /**
   * 카테고리 id를 통해서 카테고리와 카테고리에 속한 여행 계획을 함께 조회한다.
   * 로그인 인증이 없어도 조회가 가능하지만 Plan 자체에는 공개/비공개 상태가
   * 존재하기 때문에 본인이 인증이 된다면 private 여행 계획도 조회가 가능하다.
   * 즉, 본인 카테고리를 조회하는 것이 아니라면 private은 걸러내는 예외처리가 필요하다.
   * @param categoryId
   * @param req
   * @returns
   */
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

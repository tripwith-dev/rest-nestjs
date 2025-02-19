import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { Currency } from 'src/common/enum/currency';
import { CategoryService } from '../category/category.service';
import { UpdatePlanWithDestinationDto } from './dto/plan-destination.update.dto';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTravelPlan(
    @Body() createTravelPlanDto: CreatePlanDto,
    @Query('categoryId') categoryId: number,
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

    return await this.planService.createTravelPlan(
      categoryId,
      createTravelPlanDto,
    );
  }

  /**
   * 특정 여행 계획을 조회하는 엔드포인트
   */
  @Get(':planId')
  async findPlanWithCategoryByPlanId(
    @Param('planId') planId: number,
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findPlanWithCategoryByPlanId(
      planId,
      currency,
    );
  }

  @Get('top-ten/likes')
  async findTopTenTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findTopTenTravelPlan(currency);
  }

  @Get()
  async findAllTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findAllTravelPlans(currency);
  }

  /**
   * 특정 여행 계획을 업데이트하는 엔드포인트
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/update')
  async updatePlan(
    @Param('planId') planId: number,
    @Body() updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return this.planService.updatePlan(planId, updatePlanWithDestinationDto);
  }

  /**
   * 특정 여행 계획을 소프트 삭제하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns void
   */
  @Patch(':planId/delete')
  @UseGuards(JwtAuthGuard)
  async softDeletedTravelPlan(
    @Param('planId') planId: number,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return this.planService.softDeletedTravelPlan(planId);
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목과 위치정보를 조회하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  @Get(':planId/details')
  async findPlanWithDetailByPlanId(@Param('planId') planId: number) {
    return await this.planService.findPlanWithDetailByPlanId(planId);
  }

  /**
   * 특정 여행 계획의 총 비용을 조회하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param currency 변환할 통화 (USD, JPY, KRW, EUR)
   * @returns 변환된 통화로 계산된 총 비용을 반환
   */
  @Get(':planId/total-expenses')
  async getTotalExpenses(
    @Param('planId') planId: number,
    @Query('currency') currency: Currency,
  ): Promise<number> {
    return await this.planService.calculateTotalExpenses(planId, currency);
  }

  @Patch(':planId/update/main-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async replaceMainImage(
    @Param('planId') planId: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    if (!file) {
      throw new HttpException(
        '메인 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const mainImageUrl = file.path;
    console.log(mainImageUrl);
    return await this.planService.replaceMainImage(planId, mainImageUrl);
  }

  @Delete(':planId/delete/main-image')
  @UseGuards(JwtAuthGuard)
  async deleteMainImage(@Param('planId') planId: number, @Request() req: any) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planService.deleteMainImage(planId);
  }

  /**
   * 여행 계획에 좋아요를 추가하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param req 요청 객체 (사용자 정보)
   * @returns 성공 메시지
   */
  @Post(':planId/like')
  @UseGuards(JwtAuthGuard)
  async addLike(@Param('planId') planId: number, @Request() req: any) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planService.addLike(planId, avatarId);
  }

  /**
   * 여행 계획에서 좋아요를 제거하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param req 요청 객체 (사용자 정보)
   * @returns 성공 메시지
   */
  @Patch(':planId/like')
  @UseGuards(JwtAuthGuard)
  async softDeleteLike(@Param('planId') planId: number, @Request() req: any) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }
    return await this.planService.softDeleteLike(planId, avatarId);
  }
}

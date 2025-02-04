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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { Currency } from '../plandetail/plandetail.entity';
import { UpdatePlanWithDestinationDto } from './dto/plan-destination.update.dto';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /**
   * 새로운 여행 컨테이너를 생성하는 엔드포인트
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTravelPlan(
    @Body() createTravelPlanDto: CreatePlanDto,
    @Query('categoryId') categoryId: number,
  ) {
    return await this.planService.createTravelPlan(
      categoryId,
      createTravelPlanDto,
    );
  }

  /**
   * 특정 여행 계획을 조회하는 엔드포인트
   */
  @Get(':planId')
  async findPlanById(
    @Param('planId') planId: number,
    @Request() req?: any,
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    const travelPlan = await this.planService.findPlanById(planId, currency);

    return travelPlan;
  }

  @Get('topten/likes')
  async findTopTenTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findTopTenTravelPlan(currency);
  }

  @Get('all/plans')
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
  ) {
    return this.planService.updatePlan(planId, updatePlanWithDestinationDto);
  }

  /**
   * 특정 여행 계획을 소프트 삭제하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns void
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/delete')
  async softDeletedTravelPlan(@Param('planId') planId: number) {
    return this.planService.softDeletedTravelPlan(planId);
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목과 위치정보를 조회하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  @Get(':planId/details')
  async findDetailTitlesAndLocationOfPlan(@Param('planId') planId: number) {
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

  @Patch(':planId/main-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addMainImage(
    @Param('planId') planId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        '프로필 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const mainImageUrl = file.path;
    console.log(mainImageUrl);
    return await this.planService.addMainImage(planId, mainImageUrl);
  }

  @Delete(':planId/main-image')
  @UseGuards(JwtAuthGuard)
  async deleteMainImage(@Param('planId') planId: number) {
    return await this.planService.deleteMainImage(planId);
  }

  /**
   * 여행 계획에 좋아요를 추가하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param req 요청 객체 (사용자 정보)
   * @returns 성공 메시지
   */
  @UseGuards(JwtAuthGuard)
  @Post(':planId/like')
  async addLike(@Param('planId') planId: number, @Request() req: any) {
    const userId = req.user.id;
    return await this.planService.addLike(planId, userId);
  }

  /**
   * 여행 계획에서 좋아요를 제거하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param req 요청 객체 (사용자 정보)
   * @returns 성공 메시지
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':planId/like')
  async removeLike(@Param('planId') planId: number, @Request() req: any) {
    const userId = req.user.id;
    return await this.planService.removeLike(planId, userId);
  }
}

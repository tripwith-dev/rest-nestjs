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
  constructor(private readonly travelPlanService: PlanService) {}

  /**
   * 새로운 여행 컨테이너를 생성하는 엔드포인트
   * @param createTravelContainerDto 여행 컨테이너 생성 DTO
   * @param req 요청 객체
   * @returns 생성된 여행 컨테이너 객체를 반환
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTravelPlan(
    @Body() createTravelPlanDto: CreatePlanDto,
    @Query('categoryId') categoryId: number,
  ) {
    return await this.travelPlanService.createTravelPlan(
      categoryId,
      createTravelPlanDto,
    );
  }

  /**
   * 특정 여행 계획을 조회하는 엔드포인트
   * 계획의 카테고리가 PRIVATE일 수도 있기 때문에 자신의 컨테이너가 맞는지 확인해야함.
   * 로그인한 사용자는 자신의 PRIVATE 카테고리의 계획 또한 조회할 수 있고,
   * 로그인하지 않은 사용자는 PUBLIC 카테고리의 계획만 조회할 수 있음
   * @param planId 여행 계획 ID
   * @param req 요청 객체
   * @returns 조회된 여행 컨테이너 객체를 반환
   */
  @Get(':planId')
  async findPlanById(
    @Param('planId') planId: number,
    @Request() req?: any,
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    const travelPlan = await this.travelPlanService.findPlanById(
      planId,
      currency,
    );

    return travelPlan;
  }

  @Get('topten/likes')
  async findTopTenTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.travelPlanService.findTopTenTravelPlan(currency);
  }

  @Get('all/plans')
  async findAllTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.travelPlanService.findAllTravelPlans(currency);
  }

  /**
   * 특정 여행 계획을 업데이트하는 엔드포인트
   * @param planId 여행 계획 ID
   * @param updateTravelPlanDto 여행 컨테이너 업데이트 DTO
   * @returns 업데이트된 여행 계획 객체를 반환
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/update')
  async updateTravelContainer(
    @Param('planId') planId: number,
    @Body() updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
  ) {
    return this.travelPlanService.updateTravelPlan(
      planId,
      updatePlanWithDestinationDto,
    );
  }

  /**
   * 특정 여행 계획을 소프트 삭제하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns void
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/delete')
  async softDeletedTravelPlan(@Param('planId') planId: number) {
    return this.travelPlanService.softDeletedTravelPlan(planId);
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목과 위치정보를 조회하는 엔드포인트
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  @Get(':planId/details')
  async findDetailTitlesAndLocationOfPlan(@Param('planId') planId: number) {
    return await this.travelPlanService.findDetailTitlesAndLocationOfPlan(
      planId,
    );
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
    return await this.travelPlanService.calculateTotalExpenses(
      planId,
      currency,
    );
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
    return await this.travelPlanService.addMainImage(planId, mainImageUrl);
  }

  @Delete(':planId/main-image')
  @UseGuards(JwtAuthGuard)
  async deleteMainImage(@Param('planId') planId: number) {
    return await this.travelPlanService.deleteMainImage(planId);
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
    return await this.travelPlanService.addLike(planId, userId);
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
    return await this.travelPlanService.removeLike(planId, userId);
  }
}

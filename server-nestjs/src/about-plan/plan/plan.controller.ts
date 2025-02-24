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
import { OptionalAuthGuard } from 'src/about-user/jwt/jwt.optionalAuthGuard';
import { Currency } from 'src/common/enum/currency';
import { Status } from 'src/common/enum/status';
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

  /**
   * plan 생성 엔드포인트. 로그인한 유저만 가능하다.
   * 카테고리의 pk를 참조하기 때문에 categoryId를 파라미터로 받아야 한다.
   * JwtAuthGuard와 req를 통해 본인 카테고리에서 생성하는지 확인해야 한다.
   * @param createTravelPlanDto
   * @param categoryId
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTravelPlan(
    @Body() createTravelPlanDto: CreatePlanDto,
    @Query('categoryId') categoryId: number,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    // 본인 카테고리 내에서 생성하는게 맞는지 확인
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
   * 특정 여행 계획을 조회하는 엔드포인트.
   * 로그인을 하지 않은 사용자도 조회가 가능하지만 private은 조회할 수 없다.
   * 따라서 OptionalAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * plan은 여행 총 비용도 보여주기에 쿼리로 currency를 받아서
   * avatar의 currency의 맞게 총 비용을 보여주며 currency의 기본값은 KRW이다.
   * @param planId
   * @param currency
   * @param req
   * @returns
   */
  @Get(':planId')
  @UseGuards(OptionalAuthGuard)
  async findPlanWithCategoryByPlanId(
    @Param('planId') planId: number,
    @Query('currency') currency: Currency = Currency.KRW,
    @Request() req?: any,
  ) {
    // 소유자가 아니면 비공개 플랜은 조회할 수 없음
    const avatarId = req?.user?.avatar?.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    return await this.planService.findPlanWithCategoryByPlanId(
      planId,
      req?.user?.avatar?.currency || currency,
      isOwner,
    );
  }

  /**
   * 메인페이지 등에서 좋아요 수가 가장 많은 상위 10개의 여행 계획을 조회하는 엔드포인트
   * 본인 plan 여부 상관 없이 public에서 top10만 조회한다.
   * currency를 쿼리로 받아서 avatar의 currency에 맞게 변환하여 보여준다.
   * @param currency
   * @returns
   */
  @Get('top-ten/likes')
  @UseGuards(OptionalAuthGuard)
  async findTopTenTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findTopTenTravelPlan(currency);
  }

  /**
   * 모든 여행 계획을 조회하는 엔드포인트. public만 조회 가능하다.
   * currency를 쿼리로 받아서 avatar의 currency에 맞게 변환하여 보여준다.
   * @param currency
   * @returns
   */
  @Get()
  async findAllTravelPlans(
    @Query('currency') currency: Currency = Currency.KRW,
  ) {
    return await this.planService.findAllTravelPlans(currency);
  }

  /**
   * 특정 플랜과 그 플랜의 디테일을 조회하는 엔드포인트
   * private일 경우 본인 플랜이 아니면 조회할 수 없다.
   * 따라서 OptionalAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * @param planId
   * @returns
   */
  @Get(':planId/details')
  async findPlanWithDetailByPlanId(@Param('planId') planId: number) {
    return await this.planService.findPlanWithDetailByPlanId(planId);
  }

  /**
   * 특정 여행 계획을 수정하는 엔드포인트. 본인 플랜만 수정 가능하다.
   * JwtAuthGuard와 req를 통해 로그인 여부를 확인해야 한다.
   * @param planId
   * @param updatePlanWithDestinationDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/update')
  async updatePlan(
    @Param('planId') planId: number,
    @Body() updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
    @Request() req: any,
  ) {
    // 소유자만 가능
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);
    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return this.planService.updatePlan(planId, updatePlanWithDestinationDto);
  }

  /**
   * 특정 플랜의 총 비용을 계산하는 엔드포인트
   * private 플랜인 경우 소유자만 가능하다.
   * 따라서 OptionalAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * @param planId
   * @param currency
   * @returns
   */
  @Get(':planId/total-expenses')
  async getTotalExpenses(
    @Param('planId') planId: number,
    @Query('currency') currency: Currency,
  ): Promise<number> {
    return await this.planService.calculateTotalExpenses(planId, currency);
  }

  /**
   * 특정 플랜의 메인 이미지를 교체하는 엔드포인트. 소유자만 가능하다.
   * 따라서 JwtAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * @param planId
   * @param file
   * @param req
   * @returns
   */
  @Patch(':planId/update/main-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async replaceMainImage(
    @Param('planId') planId: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    // 소유자만 가능
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
    return await this.planService.replaceMainImage(planId, mainImageUrl);
  }

  /**
   * 특정 플랜의 메인 이미지를 삭제하는 엔드포인트. 소유자만 가능하다.
   * 따라서 JwtAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * @param planId
   * @param req
   * @returns
   */
  @Delete(':planId/delete/main-image')
  @UseGuards(JwtAuthGuard)
  async deleteMainImage(@Param('planId') planId: number, @Request() req: any) {
    // 소유자만 가능
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);
    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planService.deleteMainImage(planId);
  }

  /**
   * 특정 플랜에 좋아요를 추가하는 엔드포인트.
   * 로그인한 사용자만 가능하기에 JwtAuthGuard를 사용한다.
   * 플랜이 비공개이고, 소유자가 아닌 경우 좋아요를 할 수 없다.
   * @param planId
   * @param req
   * @returns
   */
  @Post(':planId/like')
  @UseGuards(JwtAuthGuard)
  async addLike(@Param('planId') planId: number, @Request() req: any) {
    // 플랜이 비공개이고, 소유자가 아닌 경우 좋아요를 할 수 없음
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);
    const plan = await this.planService.findPlanById(planId);
    if (plan.status === Status.PRIVATE && !isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planService.addLike(planId, avatarId);
  }

  /**
   * 여행 계획에서 좋아요를 제거하는 엔드포인트
   * 로그인한 사용자만 가능하기에 JwtAuthGuard를 사용한다.
   * 플랜이 비공개이고, 소유자가 아닌 경우 좋아요를 취소할 수 없다.
   * @param planId 여행 계획 ID
   * @param req 요청 객체 (사용자 정보)
   * @returns 성공 메시지
   */
  @Patch(':planId/like')
  @UseGuards(JwtAuthGuard)
  async softDeleteLike(@Param('planId') planId: number, @Request() req: any) {
    // 플랜이 비공개이고, 소유자가 아닌 경우 좋아요를 제거할 수 없음
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);
    const plan = await this.planService.findPlanById(planId);
    if (plan.status === Status.PRIVATE && !isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }
    return await this.planService.softDeleteLike(planId, avatarId);
  }

  /**
   * 특정 여행 계획을 삭제하는 엔드포인트. 본인 플랜만 삭제 가능하다.
   * JwtAuthGuard와 req를 통해 로그인 여부를 확인해야 한다.
   * hard delete가 아닌 soft delete로 처리하기에
   * planDetail, planComment, planDestination, avatarLikePlan도 삭제해야 한다.
   * @param planId
   * @param req
   * @returns
   */
  @Patch(':planId/delete')
  @UseGuards(JwtAuthGuard)
  async softDeletedTravelPlan(
    @Param('planId') planId: number,
    @Request() req: any,
  ) {
    // 소유자만 가능
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);
    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return this.planService.softDeletedTravelPlan(planId);
  }
}

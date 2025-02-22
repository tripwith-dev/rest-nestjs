import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { PlanService } from '../plan/plan.service';
import { CreateDetailWithLocationDto } from './dtos/plandetail.withLocation..create.dto';
import { UpdateDetailWithLocationDto } from './dtos/plandetail.withLocation.update.dto';
import { PlanDetailService } from './plan-detail.service';

@Controller('plan-detail')
export class PlanDetailController {
  constructor(
    private readonly planDetailService: PlanDetailService,
    private readonly planService: PlanService,
  ) {}

  /**
   * 플랜 디테일을 생성하는 엔드포인트. 로그인한 유저만 가능하다.
   * JwtAuthGuard와 req를 통해 본인 플랜에서 생성하는지 확인해야 한다.
   * @param planId
   * @param createDetailWithLocationDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPlanDetail(
    @Query('planId') planId: number,
    @Body() createDetailWithLocationDto: CreateDetailWithLocationDto,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planDetailService.createPlanDetail(
      planId,
      createDetailWithLocationDto,
    );
  }

  /**
   * 플랜 디테일 조회 엔드포인트. 플랜이 private일 경우 본인만 조회 가능하다.
   * 따라서 OptionalAuthGuard와 req를 통해 소유자인지 확인해야 한다.
   * @param detailId
   * @returns
   */
  @Get(':detailId')
  async findPlanDetailById(@Param('detailId') detailId: number) {
    const detail = await this.planDetailService.findPlanDetailById(detailId);
    return detail;
  }

  /**
   * 특정 플랜 디테일을 수정하는 엔드포인트. 본인의 플랜 디테일만 수정 가능하다.
   * JwtAuthGuard와 req를 통해 본인 플랜 디테일을 수정하는지 확인해야 한다.
   * @param detailId
   * @param updateDetailWithLocationDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':detailId/update')
  async updateTravelDetail(
    @Param('detailId') detailId: number,
    @Body() updateDetailWithLocationDto: UpdateDetailWithLocationDto,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planDetailService.isPlanDetailOwner(
      detailId,
      avatarId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planDetailService.updateTravelDetail(
      detailId,
      updateDetailWithLocationDto,
    );
  }

  /**
   * 특정 플랜의 여행 시작 날짜, 마지막 날짜를 확인하는 메서드
   * 플랜 디테일이 중복되는 시간이 있는지 확인한다.(detail이 아닌 plan으로 이동 예정)
   * plan이 private일 수도 있으므로 본인 플랜인지 확인해야 한다.
   * JwtAuthGuard와 req를 통해 본인 플랜을 확인해야 한다.
   * @param planId
   * @param startTime
   * @param endTime
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('confirm-time/:planId/:startTime/:endTime')
  async confirmTime(
    @Param('planId') planId: number,
    @Param('startTime') startTime: string,
    @Param('endTime') endTime: string,
  ) {
    return await this.planDetailService.confirmTimeOverlap(
      planId,
      startTime,
      endTime,
    );
  }

  /**
   * 특정 플랜 디테일을 삭제하는 엔드포인트. 본인의 플랜 디테일만 삭제 가능하다.
   * JwtAuthGuard와 req를 통해 본인 플랜 디테일을 삭제하는지 확인해야 한다.
   * @param detailId
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch('delete/:detailId')
  async remove(@Param('detailId') detailId: number, @Request() req: any) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planDetailService.isPlanDetailOwner(
      detailId,
      avatarId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }
    return await this.planDetailService.softDeletePlanDetail(detailId);
  }
}

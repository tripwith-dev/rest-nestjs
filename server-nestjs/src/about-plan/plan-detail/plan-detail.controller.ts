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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { PlanService } from '../plan/plan.service';
import { CreatePlanDetailDto } from './dtos/plandetail.create.dto';
import { UpdatePlanDetailDto } from './dtos/plandetail.update.dto';
import { PlanDetailService } from './plan-detail.service';

@Controller('plan-detail')
export class PlanDetailController {
  constructor(
    private readonly planDetailService: PlanDetailService,
    private readonly planService: PlanService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createPlanDetail(
    @Query('planId') planId: number,
    @Body() createPlanDetailDto: CreatePlanDetailDto,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planService.isPlanOwner(planId, avatarId);

    if (!isOwner) {
      throw new UnauthorizedException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planDetailService.createPlanDetail(
      planId,
      createPlanDetailDto,
    );
  }

  @Get(':detailId')
  async findPlanDetailById(@Param('detailId') detailId: number) {
    const detail = await this.planDetailService.findPlanDetailById(detailId);
    return detail;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':detailId/update')
  async updateTravelDetail(
    @Param('detailId') detailId: number,
    @Body() updatePlanDetailDto: UpdatePlanDetailDto,
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
      updatePlanDetailDto,
    );
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('confirmtime/:planId/:startTime/:endTime')
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
}

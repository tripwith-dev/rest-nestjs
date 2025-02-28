import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { UpdateResult } from 'typeorm';
import { PlanCommentEntity } from './plan-comment.entity';
import { PlanCommentService } from './plan-comment.service';

@Controller('plan-comment')
export class PlanCommentController {
  constructor(private readonly planCommentService: PlanCommentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPlanComment(
    @Request() req: any,
    @Query('planId') planId: number,
    @Body() pCommentContent: string,
  ): Promise<PlanCommentEntity> {
    const avatar = req.user.avatar;
    return await this.planCommentService.createPlanComment(
      avatar,
      planId,
      pCommentContent,
    );
  }

  @Get(':pCommentId')
  async findPlanCommentById(
    @Param('pCommentId') pCommentId: number,
  ): Promise<PlanCommentEntity> {
    return await this.planCommentService.findPlanCommentById(pCommentId);
  }

  @Get('my/comments')
  @UseGuards(JwtAuthGuard)
  async findPlanCommentsByAvatarId(
    @Request() req: any,
  ): Promise<PlanCommentEntity[]> {
    const avatarId = req.user.avatar.avatarId;
    return await this.planCommentService.findPlanCommentsByAvatarId(avatarId);
  }

  @Patch(':pCommentId/update')
  @UseGuards(JwtAuthGuard)
  async updatePlanComment(
    @Param('pCommentId') pCommentId: number,
    @Body() pCommentContent: string,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planCommentService.isCommentOwner(
      pCommentId,
      avatarId,
    );

    if (!isOwner) {
      throw new ForbiddenException('해당 댓글에 접근 권한이 없습니다.');
    }

    // plan 비공개/공개 여부는 updatePlanComment 내부에서 검증
    return await this.planCommentService.updatePlanComment(
      pCommentId,
      pCommentContent,
    );
  }

  @Patch(':pCommentId/delete')
  @UseGuards(JwtAuthGuard)
  async softDeletePlanComment(
    @Param('pCommentId') pCommentId: number,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    const isOwner = await this.planCommentService.isCommentOwner(
      pCommentId,
      avatarId,
    );

    if (!isOwner) {
      throw new ForbiddenException('해당 댓글에 접근 권한이 없습니다.');
    }

    return await this.planCommentService.softDeletePlanComment(pCommentId);
  }
}

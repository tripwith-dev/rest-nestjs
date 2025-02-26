import {
  Body,
  Controller,
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

  @Patch(':pCommentId/update')
  @UseGuards(JwtAuthGuard)
  async updatePlanComment(
    @Param('pCommentId') pCommentId: number,
    @Body() pCommentContent: string,
  ): Promise<UpdateResult> {
    return await this.planCommentService.updatePlanComment(
      pCommentId,
      pCommentContent,
    );
  }

  @Patch(':pCommentId/delete')
  @UseGuards(JwtAuthGuard)
  async softDeletePlanComment(
    @Param('pCommentId') pCommentId: number,
  ): Promise<UpdateResult> {
    return await this.planCommentService.softDeletePlanComment(pCommentId);
  }
}

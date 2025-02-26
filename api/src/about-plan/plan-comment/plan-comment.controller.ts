import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
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
}

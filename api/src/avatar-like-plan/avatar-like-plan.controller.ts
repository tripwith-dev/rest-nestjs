import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AvatarLikePlanService } from './avatar-like-plan.service';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';

@Controller('avatar-like-plan')
export class AvatarLikePlanController {
  constructor(private readonly avatarLikePlanService: AvatarLikePlanService) {}
  @Post(':planId')
  @UseGuards(JwtAuthGuard)
  async createOrDeleteLike(
    @Param('planId') planId: number,
    @Request() req: any,
  ) {
    const avatarId = req.user.avatar.avatarId;
    const alreadyLike = await this.avatarLikePlanService.hasUserLikedPlan(
      planId,
      avatarId,
    );
    if (alreadyLike)
      return await this.avatarLikePlanService.deleteLike(planId, avatarId);

    await this.avatarLikePlanService.addLike(planId, avatarId);
  }
}

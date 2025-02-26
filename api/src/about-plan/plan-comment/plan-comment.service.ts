import { Injectable } from '@nestjs/common';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { PlanService } from '../plan/plan.service';
import { PlanCommentEntity } from './plan-comment.entity';
import { PlanCommentRepository } from './plan-comment.repository';

@Injectable()
export class PlanCommentService {
  constructor(
    private readonly planCommentRepository: PlanCommentRepository,
    private readonly planService: PlanService,
  ) {}

  async createPlanComment(
    avatar: AvatarEntity,
    planId: number,
    pCommentContent: string,
  ): Promise<PlanCommentEntity> {
    const plan = await this.planService.findPlanById(planId);
    return await this.planCommentRepository.createPlanComment(
      avatar,
      plan,
      pCommentContent,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { UpdateResult } from 'typeorm';
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

  async findPlanCommentById(pCommentId: number): Promise<PlanCommentEntity> {
    return await this.planCommentRepository.findPlanCommentById(pCommentId);
  }

  async updatePlanComment(
    pCommentId: number,
    pCommentContent: string,
  ): Promise<UpdateResult> {
    return await this.planCommentRepository.updatePlanComment(
      pCommentId,
      pCommentContent,
    );
  }

  async softDeletePlanComment(pCommentId: number): Promise<UpdateResult> {
    return await this.planCommentRepository.softDeletePlanComment(pCommentId);
  }
}

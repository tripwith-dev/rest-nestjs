import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { Repository } from 'typeorm';
import { PlanEntity } from '../plan/plan.entity';
import { PlanCommentEntity } from './plan-comment.entity';

@Injectable()
export class PlanCommentRepository {
  constructor(
    @InjectRepository(PlanCommentEntity)
    private readonly repository: Repository<PlanCommentEntity>,
  ) {}

  async createPlanComment(
    avatar: AvatarEntity,
    plan: PlanEntity,
    pCommentContent: string,
  ): Promise<PlanCommentEntity> {
    const planComment = this.repository.create({
      avatar,
      plan,
      pCommentContent,
    });

    return await this.repository.save(planComment);
  }
}

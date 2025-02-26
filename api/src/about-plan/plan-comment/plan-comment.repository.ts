import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { Repository, UpdateResult } from 'typeorm';
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

  async findPlanCommentById(pCommentId: number): Promise<PlanCommentEntity> {
    return await this.repository
      .createQueryBuilder('pComment')
      .leftJoinAndSelect('pComment.avatar', 'avatar')
      .where('pComment.pCommentId = :pCommentId', { pCommentId })
      .andWhere('pComment.isDeleted = false')
      .getOne();
  }

  async findPlanCommentsByAvatarId(
    avatarId: number,
  ): Promise<PlanCommentEntity[]> {
    return await this.repository
      .createQueryBuilder('pComment')
      .leftJoinAndSelect('pComment.avatar', 'avatar')
      .where('avatar.avatarId = :avatarId', { avatarId })
      .andWhere('pComment.isDeleted = false')
      .andWhere('avatar.isDeleted = false')
      .getMany();
  }

  async findPlanCommentsByPlanId(planId: number): Promise<PlanCommentEntity[]> {
    return await this.repository
      .createQueryBuilder('pComment')
      .leftJoinAndSelect('pComment.avatar', 'avatar')
      .leftJoinAndSelect('pComment.plan', 'plan')
      .where('plan.planId = :planId', { planId })
      .andWhere('pComment.isDeleted = false')
      .andWhere('plan.isDeleted = false')
      .andWhere('avatar.isDeleted = false')
      .getMany();
  }

  async findPlanCommentDetailById(
    pCommentId: number,
  ): Promise<PlanCommentEntity> {
    return await this.repository
      .createQueryBuilder('pComment')
      .leftJoinAndSelect('pComment.avatar', 'avatar')
      .leftJoinAndSelect('pComment.plan', 'plan')
      .where('pComment.pCommentId = :pCommentId', { pCommentId })
      .getOne();
  }

  async updatePlanComment(
    pCommentId: number,
    pCommentContent: string,
  ): Promise<UpdateResult> {
    return await this.repository.update(pCommentId, {
      pCommentContent: pCommentContent,
      updatedAt: new Date(),
    });
  }

  async softDeletePlanComment(pCommentId: number): Promise<UpdateResult> {
    return await this.repository.update(pCommentId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}

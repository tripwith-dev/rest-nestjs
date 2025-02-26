import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

  async createPlanComment(
    avatar: AvatarEntity,
    planId: number,
    pCommentContent: string,
  ): Promise<PlanCommentEntity> {
    const plan = await this.planService.findPlanById(planId);

    // 플랜이 비공개이고, 본인 plan이 아니라면 댓글 작성 불가능
    const isPlanAccessible = await this.planService.isPlanAccessible(
      planId,
      avatar.avatarId,
    );
    if (!isPlanAccessible) {
      throw new ForbiddenException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planCommentRepository.createPlanComment(
      avatar,
      plan,
      pCommentContent,
    );
  }

  async findPlanCommentById(pCommentId: number): Promise<PlanCommentEntity> {
    const planComment =
      await this.planCommentRepository.findPlanCommentById(pCommentId);

    if (!planComment) {
      throw new NotFoundException(
        `${pCommentId}에 해당하는 댓글을 찾을 수 없습니다.`,
      );
    }

    return planComment;
  }

  async findPlanCommentsByAvatarId(
    avatarId: number,
  ): Promise<PlanCommentEntity[]> {
    const planComments =
      await this.planCommentRepository.findPlanCommentsByAvatarId(avatarId);

    if (!planComments) {
      throw new NotFoundException(`해당 사용자의 댓글을 조회할 수 없습니다.`);
    }

    return planComments;
  }

  async updatePlanComment(
    pCommentId: number,
    pCommentContent: string,
  ): Promise<UpdateResult> {
    const pComment = await this.findPlanCommentDetailById(pCommentId);
    const isPlanAccessible = await this.planService.isPlanAccessible(
      pComment.plan.planId,
      pComment.avatar.avatarId,
    );

    if (!isPlanAccessible) {
      throw new ForbiddenException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planCommentRepository.updatePlanComment(
      pCommentId,
      pCommentContent,
    );
  }

  async softDeletePlanComment(pCommentId: number): Promise<UpdateResult> {
    const pComment = await this.findPlanCommentDetailById(pCommentId);
    const isPlanAccessible = await this.planService.isPlanAccessible(
      pComment.plan.planId,
      pComment.avatar.avatarId,
    );

    if (!isPlanAccessible) {
      throw new ForbiddenException('해당 플랜에 접근 권한이 없습니다.');
    }

    return await this.planCommentRepository.softDeletePlanComment(pCommentId);
  }

  // ===========================================================
  // =========================== SUB ===========================
  // ===========================================================

  async isCommentOwner(pCommentId: number, avatarId: number) {
    const pComment = await this.findPlanCommentById(pCommentId);
    return pComment.avatar.avatarId === avatarId;
  }

  async findPlanCommentDetailById(
    pCommentId: number,
  ): Promise<PlanCommentEntity> {
    const planComment =
      await this.planCommentRepository.findPlanCommentDetailById(pCommentId);

    if (!planComment) {
      throw new NotFoundException(
        `${pCommentId}에 해당하는 댓글을 찾을 수 없습니다.`,
      );
    }

    return planComment;
  }
}

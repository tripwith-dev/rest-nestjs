import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AvatarLikePlanRepository } from './avatar-like-plan.repository';
import { PlanService } from 'src/about-plan/plan/plan.service';
import { DeleteResult, InsertResult } from 'typeorm';
import { AvatarLikePlanEntity } from './avatar-like-plan.entity';

@Injectable()
export class AvatarLikePlanService {
  constructor(
    private readonly avatarLikePlanRepository: AvatarLikePlanRepository,
    private readonly planSerive: PlanService,
  ) {}

  /**
   * 사용자가 여행 계획에 좋아요를 눌렀는지 확인
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   * @returns boolean (true: 이미 좋아요 함, false: 좋아요 안 함)
   */
  async hasUserLikedPlan(planId: number, avatarId: number): Promise<boolean> {
    const isAccessible = await this.planSerive.isPlanAccessible(
      planId,
      avatarId,
    );

    // 해당 플랜이 private이고, owner가 아니라면 like/dislike 불가능
    if (!isAccessible)
      throw new UnauthorizedException('해당 플랜에 접근할 권한이 없습니다.');

    return await this.avatarLikePlanRepository.hasUserLikedPlan(
      planId,
      avatarId,
    );
  }

  /**
   * 여행 계획에 좋아요를 추가 및 likesCount 증가
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async addLike(planId: number, avatarId: number): Promise<InsertResult> {
    return await this.avatarLikePlanRepository.addLike(planId, avatarId);
  }

  /**
   * 여행 계획에서 좋아요를 제거 hard delete
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   */
  async deleteLike(planId: number, avatarId: number): Promise<DeleteResult> {
    return await this.avatarLikePlanRepository.deleteLike(planId, avatarId);
  }

  async findAvatarLikePlanByAvatarId(
    avatarId: number,
  ): Promise<AvatarLikePlanEntity[]> {
    const plans =
      await this.avatarLikePlanRepository.findAvatarLikePlanByAvatarId(
        avatarId,
      );

    // 각 plan에 대해서 owner인지 확인하고 status에 따라 필터링
    const filteredPlans = [];

    for (const plan of plans) {
      const isOwner = await this.planSerive.isPlanOwner(plan.planId, avatarId);

      // isOwner가 true이면 모든 status 표시, 아니면 public만 표시
      if (isOwner || plan.plan.status === 'PUBLIC') {
        filteredPlans.push(plan);
      }
    }

    return filteredPlans;
  }
}

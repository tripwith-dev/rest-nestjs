import { Injectable } from '@nestjs/common';
import { AvatarLikePlanRepository } from './avatar-like-plan.repository';

@Injectable()
export class AvatarLikePlanService {
  constructor(
    private readonly avatarLikePlanRepository: AvatarLikePlanRepository,
  ) {}

  /**
   * 사용자가 여행 계획에 좋아요를 눌렀는지 확인
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   * @returns boolean (true: 이미 좋아요 함, false: 좋아요 안 함)
   */
  async hasUserLikedPlan(planId: number, avatarId: number): Promise<boolean> {
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
  async addLike(planId: number, avatarId: number): Promise<void> {
    await this.avatarLikePlanRepository.addLike(planId, avatarId);
  }

  /**
   * 여행 계획에서 좋아요를 제거 (Soft Delete) 및 likesCount 감소
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   */
  async softDeleteLike(planId: number, avatarId: number): Promise<void> {
    await this.avatarLikePlanRepository.softDeleteLike(planId, avatarId);
  }
}

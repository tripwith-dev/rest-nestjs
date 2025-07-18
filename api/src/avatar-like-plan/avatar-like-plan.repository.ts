import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { DataSource, Repository } from 'typeorm';
import { AvatarLikePlanEntity } from './avatar-like-plan.entity';

@Injectable()
export class AvatarLikePlanRepository {
  constructor(
    @InjectRepository(AvatarLikePlanEntity)
    private readonly repository: Repository<AvatarLikePlanEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 사용자가 여행 계획에 좋아요를 눌렀는지 확인
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   * @returns boolean (true: 이미 좋아요 함, false: 좋아요 안 함)
   */
  async hasUserLikedPlan(planId: number, avatarId: number): Promise<boolean> {
    const result = await this.repository.findOne({
      where: {
        plan: { planId },
        avatar: { avatarId },
      },
    });
    return !!result;
  }

  /**
   * 여행 계획에 좋아요를 추가 및 likesCount 증가
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async addLike(planId: number, avatarId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 좋아요 추가
      const like = this.repository.create({
        plan: { planId },
        avatar: { avatarId },
      });
      await manager.save(like);

      // likesCount 증가
      await manager.increment(PlanEntity, { planId }, 'likesCount', 1);
    });
  }

  /**
   * 여행 계획에서 좋아요를 제거 (Hard Delete) 및 likesCount 감소
   * @param planId 여행 계획 ID
   * @param avatarId 사용자 ID
   */
  async deleteLike(planId: number, avatarId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(AvatarLikePlanEntity, { planId, avatarId });

      // likesCount 감소
      await manager.decrement(PlanEntity, { planId }, 'likesCount', 1);
    });
  }
}

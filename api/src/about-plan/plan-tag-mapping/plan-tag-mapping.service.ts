import { Injectable } from '@nestjs/common';
import { PlanTagEntity } from '../plan-tag/plan-tag.entity';
import { PlanTagService } from '../plan-tag/plan-tag.service';
import { PlanEntity } from '../plan/plan.entity';
import { PlanTagMappingEntity } from './plan-tag-mapping.entity';
import { PlanTagMappingRepository } from './plan-tag-mapping.repository';

@Injectable()
export class PlanTagMappingService {
  constructor(
    private readonly planTagMappingRepository: PlanTagMappingRepository,
    private readonly planTagService: PlanTagService,
  ) {}

  async createPlanDestination(plan: PlanEntity, planTag: PlanTagEntity) {
    return await this.planTagMappingRepository.createPlanDestination(
      plan,
      planTag,
    );
  }

  async deletePlanTagMappings(
    planTagMappings: PlanTagMappingEntity[],
  ): Promise<void> {
    await this.planTagMappingRepository.deletePlanDestinations(planTagMappings);
  }

  /**
   * 카테고리의 destination 태그를 업데이트
   * @param plan - 업데이트 대상이 되는 여행 계획 엔티티
   * @param newDestinations - 업데이트할 새로운 목적지 이름 배열
   * @returns {Promise<void>} - 처리 완료 후 반환값 없음
   * @throws {Error} - 목적지 추가 또는 삭제 처리 중 발생하는 문제
   */
  async updatePlanTags(plan: PlanEntity, newTags: string[]): Promise<void> {
    // 기존 destination 가져오기
    const tagMappings = plan.tagMappings || [];
    console.log(tagMappings);
    console.log(newTags);

    // destinationName만 비교하기 위해 매핑
    // 기존 destinationName과 새로운 destinationName 비교를 위해 Set 이용
    const existingNames = new Set(
      tagMappings.map((dest) => dest.planTag.pTagName),
    );
    const newNames = new Set(newTags || []);

    // newDestinations가 null 또는 빈 배열인 경우 모든 요소 삭제
    if (!newTags || newTags.length === 0) {
      await this.deletePlanTagMappings(tagMappings);
    } else {
      // 생성할 요소 찾기: 새로운 데이터에는 있고, 기존 데이터에는 없는 것을 초이스
      const tagsToAdd = [...newNames].filter(
        (name) => !existingNames.has(name),
      );

      // 삭제할 요소 찾기: 새로운 데이터에는 없고, 기존 데이터에는 있는 것을 초이스
      const destinationsToRemove = tagMappings.filter(
        (categoryDest) => !newNames.has(categoryDest.planTag.pTagName),
      );

      // 삭제 요소 제거
      if (destinationsToRemove.length > 0) {
        await this.deletePlanTagMappings(destinationsToRemove);
      }

      // 추가 요소 처리
      for (const destinationName of tagsToAdd) {
        let destination =
          await this.planTagService.findOneByDestinationName(destinationName);
        // 추가할 요소가 destination 테이블에 없다면 추가 후 관계 테이블 설정
        if (!destination) {
          destination =
            await this.planTagService.createDestination(destinationName);
        }
        await this.createPlanDestination(plan, destination);
      }
    }
  }
}

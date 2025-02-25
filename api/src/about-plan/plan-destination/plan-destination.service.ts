import { Injectable } from '@nestjs/common';
import { DestinationTagEntity } from '../destination-tag/destination-tag.entity';
import { DestinationTagService } from '../destination-tag/destination-tag.service';
import { PlanEntity } from '../plan/plan.entity';
import { PlanDestinationEntity } from './plan-destination.entity';
import { PlanDestinationRepository } from './plan-destination.repository';

@Injectable()
export class PlanDestinationService {
  constructor(
    private readonly planDestinationRepository: PlanDestinationRepository,
    private readonly destinationTagService: DestinationTagService,
  ) {}

  async createPlanDestination(
    plan: PlanEntity,
    destination: DestinationTagEntity,
  ) {
    return await this.planDestinationRepository.createPlanDestination(
      plan,
      destination,
    );
  }

  async deletePlanDestinations(
    planDestinations: PlanDestinationEntity[],
  ): Promise<void> {
    await this.planDestinationRepository.deletePlanDestinations(
      planDestinations,
    );
  }

  /**
   * 카테고리의 destination 태그를 업데이트
   * @param plan - 업데이트 대상이 되는 여행 계획 엔티티
   * @param newDestinations - 업데이트할 새로운 목적지 이름 배열
   * @returns {Promise<void>} - 처리 완료 후 반환값 없음
   * @throws {Error} - 목적지 추가 또는 삭제 처리 중 발생하는 문제
   */
  async updateDestinationTags(
    plan: PlanEntity,
    newDestinations: string[],
  ): Promise<void> {
    // 기존 destination 가져오기
    const existingPlanDestinations = plan.destinations;

    // destinationName만 비교하기 위해 매핑
    // 기존 destinationName과 새로운 destinationName 비교를 위해 Set 이용
    const existingNames = new Set(
      existingPlanDestinations.map(
        (dest) => dest.destinationTag.destinationTagName,
      ),
    );
    const newNames = new Set(newDestinations || []);

    // newDestinations가 null 또는 빈 배열인 경우 모든 요소 삭제
    if (!newDestinations || newDestinations.length === 0) {
      await this.deletePlanDestinations(existingPlanDestinations);
    } else {
      // 생성할 요소 찾기: 새로운 데이터에는 있고, 기존 데이터에는 없는 것을 초이스
      const destinationsToAdd = [...newNames].filter(
        (name) => !existingNames.has(name),
      );

      // 삭제할 요소 찾기: 새로운 데이터에는 없고, 기존 데이터에는 있는 것을 초이스
      const destinationsToRemove = existingPlanDestinations.filter(
        (categoryDest) =>
          !newNames.has(categoryDest.destinationTag.destinationTagName),
      );

      // 삭제 요소 제거
      if (destinationsToRemove.length > 0) {
        console.log(destinationsToRemove);

        await this.deletePlanDestinations(destinationsToRemove);
      }

      // 추가 요소 처리
      for (const destinationName of destinationsToAdd) {
        let destination =
          await this.destinationTagService.findOneByDestinationName(
            destinationName,
          );
        // 추가할 요소가 destination 테이블에 없다면 추가 후 관계 테이블 설정
        if (!destination) {
          destination =
            await this.destinationTagService.createDestination(destinationName);
        }
        await this.createPlanDestination(plan, destination);
      }
    }
  }
}

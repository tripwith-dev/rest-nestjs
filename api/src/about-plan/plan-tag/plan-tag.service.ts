import { Injectable } from '@nestjs/common';
import { PlanTagEntity } from './plan-tag.entity';
import { PlanTagRepository } from './plan-tag.repository';

@Injectable()
export class PlanTagService {
  constructor(private readonly planTagRepository: PlanTagRepository) {}

  /**
   * 새로운 여행지(Destination)를 생성하는 메서드
   * @param pTagName - 생성할 태그의 내용
   * @returns 생성된 PlanTagEntity
   */
  async createDestination(pTagName: string): Promise<PlanTagEntity> {
    return await this.planTagRepository.createDestination(pTagName);
  }

  /**
   * 여행지(Destination) 이름으로 하나의 여행지 정보를 찾는 메서드
   * @param pTagName - 찾고자 하는 태그의 내용
   * @returns 찾은 PlanTagEntity 또는 데이터가 없을 경우 undefined
   */
  async findOneByDestinationName(
    pTagName: string,
  ): Promise<PlanTagEntity | undefined> {
    return await this.planTagRepository.findDestinationByName(pTagName);
  }
}

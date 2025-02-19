import { Injectable } from '@nestjs/common';
import { DestinationTagEntity } from './destination-tag.entity';
import { DestinationTagRepository } from './destination-tag.repository';

@Injectable()
export class DestinationTagService {
  constructor(
    private readonly destinationRepository: DestinationTagRepository,
  ) {}

  /**
   * 새로운 여행지(Destination)를 생성하는 메서드
   * @param destinationName - 생성할 여행지의 이름
   * @returns 생성된 DestinationEntity
   */
  async createDestination(
    destinationTagName: string,
  ): Promise<DestinationTagEntity> {
    return await this.destinationRepository.createDestination(
      destinationTagName,
    );
  }

  /**
   * 여행지(Destination) 이름으로 하나의 여행지 정보를 찾는 메서드
   * @param destinationName - 찾고자 하는 여행지의 이름
   * @returns 찾은 DestinationEntity 또는 데이터가 없을 경우 undefined
   */
  async findOneByDestinationName(
    destinationTagName: string,
  ): Promise<DestinationTagEntity | undefined> {
    return await this.destinationRepository.findDestinationByName(
      destinationTagName,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { DestinationEntity } from './destination.entity';
import { DestinationRepository } from './destination.repository';

@Injectable()
export class DestinationService {
  constructor(private readonly destinationRepository: DestinationRepository) {}

  /**
   * 새로운 여행지(Destination)를 생성하는 메서드
   * @param destinationName - 생성할 여행지의 이름
   * @returns 생성된 DestinationEntity
   */
  async createDestination(destinationName: string): Promise<DestinationEntity> {
    return await this.destinationRepository.createDestination(destinationName);
  }

  /**
   * 여행지(Destination) 이름으로 하나의 여행지 정보를 찾는 메서드
   * @param destinationName - 찾고자 하는 여행지의 이름
   * @returns 찾은 DestinationEntity 또는 데이터가 없을 경우 undefined
   */
  async findOneByDestinationName(
    destinationName: string,
  ): Promise<DestinationEntity | undefined> {
    return await this.destinationRepository.findDestinationByName(
      destinationName,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DestinationEntity } from './destination.entity';

@Injectable()
export class DestinationRepository {
  constructor(
    @InjectRepository(DestinationEntity)
    private readonly repository: Repository<DestinationEntity>,
  ) {}
  async createDestination(destinationName: string): Promise<DestinationEntity> {
    const destination = this.repository.create({ destinationName });
    return await this.repository.save(destination);
  }

  async findDestinationByName(
    destinationName: string,
  ): Promise<DestinationEntity | undefined> {
    return await this.repository
      .createQueryBuilder('destination')
      .where('destination.destinationName = :destinationName', {
        destinationName,
      })
      .select(['destination.destinationId', 'destination.destinationName'])
      .getOne();
  }
}

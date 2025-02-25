import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DestinationTagEntity } from './destination-tag.entity';

@Injectable()
export class DestinationTagRepository {
  constructor(
    @InjectRepository(DestinationTagEntity)
    private readonly repository: Repository<DestinationTagEntity>,
  ) {}
  async createDestination(
    destinationTagName: string,
  ): Promise<DestinationTagEntity> {
    const destination = this.repository.create({ destinationTagName });
    return await this.repository.save(destination);
  }

  async findDestinationByName(
    destinationTagName: string,
  ): Promise<DestinationTagEntity | undefined> {
    return await this.repository
      .createQueryBuilder('destination_tag')
      .where('destination_tag.destinationTagName = :destinationTagName', {
        destinationTagName,
      })
      .select([
        'destination_tag.destinationTagId',
        'destination_tag.destinationTagName',
      ])
      .getOne();
  }
}

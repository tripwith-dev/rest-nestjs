import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanTagEntity } from './plan-tag.entity';

@Injectable()
export class PlanTagRepository {
  constructor(
    @InjectRepository(PlanTagEntity)
    private readonly repository: Repository<PlanTagEntity>,
  ) {}
  async createDestination(pTagName: string): Promise<PlanTagEntity> {
    const destination = this.repository.create({ pTagName });
    return await this.repository.save(destination);
  }

  async findDestinationByName(
    pTagName: string,
  ): Promise<PlanTagEntity | undefined> {
    return await this.repository
      .createQueryBuilder('tag')
      .where('tag.pTagName = :pTagName', {
        pTagName,
      })
      .select(['tag.pTagId', 'tag.pTagName'])
      .getOne();
  }
}

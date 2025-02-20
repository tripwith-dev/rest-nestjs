import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dtos/location.create.dto';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
  ) {}

  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationEntity> {
    const location = this.repository.create(createLocationDto);
    return await this.repository.save(location);
  }

  async findLocationById(locationId: number): Promise<LocationEntity> {
    return await this.repository
      .createQueryBuilder('location')
      .where('location.locationId= :locationId', { locationId })
      .getOne();
  }

  async findLocationByName(locationName: string): Promise<LocationEntity> {
    return await this.repository
      .createQueryBuilder('location')
      .where('location.locationName= :locationName', { locationName })
      .getOne();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
  ) {}

  async createLocation(
    locationName: string,
    latitude: string,
    longitude: string,
  ): Promise<LocationEntity> {
    const location = this.repository.create({
      locationName,
      latitude,
      longitude,
    });
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

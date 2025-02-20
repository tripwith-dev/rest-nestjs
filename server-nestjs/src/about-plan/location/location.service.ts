import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dtos/location.create.dto';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationEntity> {
    // location name이 이미 있는지 확인
    const location = await this.locationRepository.findLocationByName(
      createLocationDto.locationName,
    );

    // 이미 있으면 location 그대로 return, 없으면 새로 만듦
    if (!location) {
      return await this.locationRepository.createLocation(createLocationDto);
    }

    return location;
  }

  async findLocationById(locationId: number): Promise<LocationEntity> {
    const location = await this.locationRepository.findLocationById(locationId);
    if (!location) throw new NotFoundException("can't find location");
    return location;
  }

  async findLocationByName(locationName: string): Promise<LocationEntity> {
    const location =
      await this.locationRepository.findLocationByName(locationName);
    if (!location) throw new NotFoundException("can't find location");
    return location;
  }
}

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
    const location = await this.locationRepository.findLocationByName(
      createLocationDto.locationName,
    );

    // location name 똑같으면 있는거 return, 없으면 새로 만듦
    if (!location) {
      return await this.locationRepository.createLocation(createLocationDto);
    } else {
      return location;
    }
  }

  async findLocationById(locationId: number): Promise<LocationEntity> {
    const location = await this.locationRepository.findLocationById(locationId);
    if (!location) throw new NotFoundException("can't find location");
    return location;
  }
}

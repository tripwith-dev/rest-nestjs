import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async createLocation(
    locationName: string,
    latitude: string,
    longitude: string,
  ): Promise<LocationEntity> {
    const location = await this.findLocationByName(locationName);

    // location name 똑같으면 있는거 return, 없으면 새로 만듦
    if (!location) {
      return await this.locationRepository.createLocation(
        locationName,
        latitude,
        longitude,
      );
    } else {
      return location;
    }
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

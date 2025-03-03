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
    let location = await this.locationRepository.findLocationByPlaceId(
      createLocationDto.placeId,
    );

    // 없으면 새로 생성
    if (!location) {
      const newLocation =
        await this.locationRepository.createLocation(createLocationDto);

      // 타입 매핑 추가
      if (
        newLocation &&
        createLocationDto.types &&
        createLocationDto.types.length > 0
      ) {
        await this.locationRepository.addLocationTypes(
          newLocation,
          createLocationDto.types,
        );
      }

      location = newLocation; // location을 새로 생성된 newLocation으로 설정
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

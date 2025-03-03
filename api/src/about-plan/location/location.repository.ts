import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dtos/location.create.dto';
import { LocationTypeMappingEntity } from './location-type-mapping.entity';
import { LocationTypeEntity } from './location-type.entity';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(LocationTypeMappingEntity)
    private readonly locationTypeMappingRepository: Repository<LocationTypeMappingEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>,
  ) {}

  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationEntity> {
    const location = this.locationRepository.create(createLocationDto);
    return await this.locationRepository.save(location);
  }

  async findLocationById(locationId: number): Promise<LocationEntity> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where('location.locationId= :locationId', { locationId })
      .getOne();
  }

  // Location에 타입 추가
  async addLocationTypes(
    location: LocationEntity,
    types: string[],
  ): Promise<void> {
    // 전달된 type들을 찾거나 새로 만들어서 연결
    const typeMappings = await Promise.all(
      types.map(async (type) => {
        let locationType = await this.locationTypeRepository.findOne({
          where: { type },
        });

        if (!locationType) {
          locationType = this.locationTypeRepository.create({ type });
          await this.locationTypeRepository.save(locationType);
        }

        return this.locationTypeMappingRepository.create({
          location: location,
          type: locationType,
        });
      }),
    );

    // 중간 테이블에 연결 정보 저장
    await this.locationTypeMappingRepository.save(typeMappings);
  }

  async findLocationByPlaceId(placeId: string): Promise<LocationEntity> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where('location.placeId= :placeId', { placeId })
      .getOne();
  }

  async findLocationByName(locationName: string): Promise<LocationEntity> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where('location.locationName= :locationName', { locationName })
      .getOne();
  }
}

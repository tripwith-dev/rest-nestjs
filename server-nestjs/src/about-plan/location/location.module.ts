import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationTypeMappingEntity } from './location-type-mapping.entity';
import { LocationTypeEntity } from './location-type.entity';
import { LocationController } from './location.controller';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationEntity,
      LocationTypeEntity,
      LocationTypeMappingEntity,
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}

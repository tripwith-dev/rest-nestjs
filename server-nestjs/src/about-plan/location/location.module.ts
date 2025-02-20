import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationService, LocationRepository],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}

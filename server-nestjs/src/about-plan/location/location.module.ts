import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationModule])],
  providers: [LocationService],
})
export class LocationModule {}

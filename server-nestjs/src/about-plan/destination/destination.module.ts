import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationEntity } from './destination.entity';
import { DestinationRepository } from './destination.repository';
import { DestinationService } from './destination.service';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationEntity])],
  providers: [DestinationService, DestinationRepository],
  exports: [DestinationService, DestinationRepository],
})
export class DestinationModule {}

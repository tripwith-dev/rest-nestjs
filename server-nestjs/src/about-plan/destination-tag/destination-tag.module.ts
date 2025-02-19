import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationTagEntity } from './destination-tag.entity';
import { DestinationTagRepository } from './destination-tag.repository';
import { DestinationTagService } from './destination-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationTagEntity])],
  providers: [DestinationTagService, DestinationTagRepository],
  exports: [DestinationTagService, DestinationTagRepository],
})
export class DestinationTagModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationEntity } from './destination.entity';

@Module({ imports: [TypeOrmModule.forFeature([DestinationEntity])] })
export class DestinationModule {}

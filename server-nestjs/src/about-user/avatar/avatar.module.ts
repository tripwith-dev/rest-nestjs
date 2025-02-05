import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { AvatarService } from './avatar.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarEntity, AvatarRepository])],
  providers: [AvatarService, AvatarRepository],
  exports: [AvatarService, AvatarRepository],
})
export class AvatarModule {}

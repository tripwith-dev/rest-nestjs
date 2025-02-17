import { PickType } from '@nestjs/swagger';
import { AvatarEntity } from '../avatar.entity';

export class UpdateIntroduceDto extends PickType(AvatarEntity, ['introduce']) {}

import { PickType } from '@nestjs/swagger';
import { AvatarEntity } from '../avatar.entity';

export class CreateAvatarDto extends PickType(AvatarEntity, ['nickname']) {}

import { PickType } from '@nestjs/swagger';
import { AvatarEntity } from '../avatar.entity';

export class UpdateNicknameDto extends PickType(AvatarEntity, ['nickname']) {}

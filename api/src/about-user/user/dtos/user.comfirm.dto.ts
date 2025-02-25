import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class ConfirmUserDto extends OmitType(UserEntity, [
  'password',
] as const) {}

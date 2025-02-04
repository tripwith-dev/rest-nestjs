import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class RegisterUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'username',
  'nickname',
]) {}

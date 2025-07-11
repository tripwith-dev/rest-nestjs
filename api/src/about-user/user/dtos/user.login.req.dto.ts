import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class LoginUserDto extends PickType(UserEntity, ['email', 'password']) {}

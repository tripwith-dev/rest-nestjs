import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class UpdateUserNameDto extends PickType(UserEntity, ['username']) {}

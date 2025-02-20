import { PickType } from '@nestjs/swagger';
import { LocationEntity } from '../location.entity';

export class CreateLocationDto extends PickType(LocationEntity, [
  'address',
  'latitude',
  'longitude',
]) {}

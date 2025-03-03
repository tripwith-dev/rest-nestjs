import { ApiProperty, PickType } from '@nestjs/swagger';
import { LocationEntity } from '../location.entity';

export class CreateLocationDto extends PickType(LocationEntity, [
  'address',
  'latitude',
  'longitude',
  'placeId',
  'locationRating',
]) {
  @ApiProperty({
    description: 'Array of location types (e.g. restaurant, park, etc.)',
    type: [String],
  })
  types: string[];
}

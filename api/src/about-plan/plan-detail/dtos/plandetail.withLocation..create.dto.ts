import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/about-plan/location/dtos/location.create.dto';
import { CreateDetailDto } from './plandetail.create.dto';

export class CreateDetailWithLocationDto {
  @ValidateNested()
  @Type(() => CreateDetailDto)
  createDetailDto: CreateDetailDto;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  createLocationDto: CreateLocationDto;
}

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/about-plan/location/dtos/location.create.dto';
import { UpdateDetailDto } from './plandetail.update.dto';

export class UpdateDetailWithLocationDto {
  @ValidateNested()
  @Type(() => UpdateDetailDto)
  updateDetailDto: UpdateDetailDto;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  createLocationDto: CreateLocationDto;
}

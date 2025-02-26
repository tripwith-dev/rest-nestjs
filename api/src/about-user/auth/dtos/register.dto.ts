import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAvatarDto } from 'src/about-user/avatar/dtos/avatar.create.dto';
import { RegisterUserDto } from 'src/about-user/user/dtos/user.register.req.dto';

export class RegisterDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @ValidateNested()
  @Type(() => CreateAvatarDto)
  avatar: CreateAvatarDto;
}

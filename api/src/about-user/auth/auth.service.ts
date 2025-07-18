import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CategoryService } from 'src/about-plan/category/category.service';
import {
  validateNickname,
  validatePassword,
  validateUsername,
} from 'src/utils/validateUserInput';
import { UpdateResult } from 'typeorm';
import { AvatarService } from '../avatar/avatar.service';
import { ConfirmUserDto } from '../user/dtos/user.comfirm.dto';
import { LoginUserDto } from '../user/dtos/user.login.req.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
  ) {}

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

  /**
   * 회원가입
   */
  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto.user;
    const { nickname } = registerDto.avatar;

    // 1. email 중복 확인
    await this.userService.existsByEmail(email);

    // 2. 닉네임 중복 확인
    await this.avatarService.existsByNickname(nickname);

    // 3. 유효성 검사
    validatePassword(password);
    validateUsername(username);
    validateNickname(nickname);

    // 4. 패스워드 해시화 후 user 데이터 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const registeredUser = await this.userService.createUser({
      email,
      password: hashedPassword,
      username,
    });

    // 5. 아바타(프로필) 생성
    if (registeredUser) {
      await this.avatarService.createAvatar(registerDto.avatar, registeredUser);
    }

    return await this.userService.findUserWithAvatar(registeredUser.id);
  }

  /**
   * 로그인
   */
  async jwtLogIn(userLoginDto: LoginUserDto, response: Response) {
    const { user, jwt } = await this.verifyUserAndSignJwt(
      userLoginDto.email,
      userLoginDto.password,
    );

    // response.cookie('jwt', jwt, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    // });

    const loginUser = await this.userService.findUserWithAvatar(user.id);

    return { loginUser, jwt };
  }

  async softDeleteUser(userId: number): Promise<UpdateResult> {
    const user = await this.userService.findUserWithAvatar(userId);
    await this.categoryService.softDeleteCategoriesByAvatar(
      user.avatar.avatarId,
    );
    await this.avatarService.softDeleteAvatar(user.avatar.avatarId);
    return await this.userService.softDeleteUser(user.id);
  }

  // ===========================================================
  // =========================== SUB ===========================
  // ===========================================================

  /**
   * id, password 확인 + jwt 생성
   */
  async verifyUserAndSignJwt(
    email: LoginUserDto['email'],
    password: LoginUserDto['password'],
  ): Promise<{ jwt: string; user: ConfirmUserDto }> {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('해당 이메일 계정은 존재하지 않습니다.');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');

    try {
      const jwt = await this.jwtService.signAsync(
        { sub: user.id },
        { secret: this.configService.get('JWT_SECRET') },
      );
      return { user, jwt };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { UnauthorizedException } from '@nestjs/common';

/**
 * 비밀번호 유효성 검사
 * @param password 비밀번호 문자열
 */
export function validatePassword(password: string): void {
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase) {
    throw new UnauthorizedException(
      '비밀번호는 최소 하나의 대문자를 포함해야 합니다.',
    );
  }

  if (!hasSpecialChar) {
    throw new UnauthorizedException(
      '비밀번호는 최소 하나의 특수기호를 포함해야 합니다.',
    );
  }

  if (password.length < 10) {
    throw new UnauthorizedException('비밀번호는 최소 10자 이상이어야 합니다.');
  }
}

/**
 * 이름 유효성 검사
 * @param username 이름 문자열
 */
export function validateUsername(username: string): void {
  const nameRegex = /^[a-zA-Z가-힣0-9]{2,30}$/;

  if (!nameRegex.test(username)) {
    throw new UnauthorizedException(
      '이름은 2~30자 이내여야 하며, 특수기호를 포함할 수 없습니다.',
    );
  }
}

/**
 * 닉네임 유효성 검사
 * @param nickname 닉네임 문자열
 */
export function validateNickname(nickname: string): void {
  const nicknameRegex = /^[a-zA-Z0-9가-힣_-]{4,20}$/;

  if (!nicknameRegex.test(nickname)) {
    throw new UnauthorizedException(
      '닉네임은 4~20자 이내여야 하며, 한글, 영어, 숫자, _, - 만 허용됩니다.',
    );
  }
}

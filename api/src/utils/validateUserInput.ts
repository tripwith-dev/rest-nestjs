import { BadRequestException, UnauthorizedException } from '@nestjs/common';

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
    throw new BadRequestException('비밀번호는 최소 10자 이상이어야 합니다.');
  }
}

/**
 * 이름 유효성 검사
 * @param username 이름 문자열
 */
export function validateUsername(username: string): void {
  const nameRegex = /^[a-zA-Z가-힣\t' ']{2,20}$/;

  if (!nameRegex.test(username)) {
    throw new BadRequestException(
      '이름은 2~20자 이내여야 하며, 숫자와 특수기호를 포함할 수 없습니다.',
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
    throw new BadRequestException(
      '닉네임은 4~20자 이내여야 하며, 한글, 영어, 숫자, _, - 만 허용됩니다.',
    );
  }
}

export function validateCategoryTitle(title: string): void {
  if (title.length > 20) {
    throw new BadRequestException(`카테고리 제목은 20자 내여야 합니다.`);
  }
}

export function validatePlanTitle(planTitle: string) {
  if (planTitle.length > 30) {
    throw new BadRequestException(`계획 제목은 30자 이내입니다.`);
  }
}

export function validateDates(startDate?: string, endDate?: string): void {
  if (startDate && endDate) {
    // YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
    const formattedStartDate = `${startDate.slice(0, 4)}-${startDate.slice(4, 6)}-${startDate.slice(6, 8)}`;
    const formattedEndDate = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`;

    const start = new Date(formattedStartDate);
    const end = new Date(formattedEndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('유효한 날짜 형식이 아닙니다.');
    }

    if (start > end) {
      throw new BadRequestException(
        '여행 시작 날짜는 종료 날짜보다 클 수 없습니다.',
      );
    }
  }
}

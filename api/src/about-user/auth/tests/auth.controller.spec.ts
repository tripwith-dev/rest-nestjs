import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../../user/dtos/user.login.req.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // AuthService의 mock 객체 생성
    const mockAuthService = {
      register: jest.fn(),
      jwtLogIn: jest.fn(),
      softDeleteUser: jest.fn(),
    };

    // 테스트 모듈 설정
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService }, // AuthService를 mock으로 제공
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController); // 컨트롤러 가져오기
    authService = module.get<AuthService>(AuthService); // 서비스 가져오기
  });

  it('should be defined', () => {
    // 컨트롤러가 정의되어 있는지 확인
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto: RegisterDto = {
        user: { email: 'test@example.com', password: 'password123', username: 'testuser' },
        avatar: { nickname: 'testnickname' },
      };

      // AuthService의 register 메서드가 mockResolvedValue로 "Registered User" 반환하도록 설정
      authService.register = jest.fn().mockResolvedValue('Registered User');
      
      // register 메서드 호출
      const result = await controller.register(registerDto);

      // register 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      // 반환된 결과가 예상한 값인지 확인
      expect(result).toBe('Registered User');
    });
  });

  describe('logIn', () => {
    it('should call authService.jwtLogIn with correct parameters and return expected result', async () => {
      const loginDto: LoginUserDto = { email: 'test@example.com', password: 'password123' };
      
      // Response 객체 mock 설정
      const response = { 
        status: jest.fn().mockReturnThis(), 
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as unknown as Response;
  
      // authService.jwtLogIn 메서드가 mockResolvedValue로 { jwt: 'mockJwtToken' } 반환하도록 설정
      authService.jwtLogIn = jest.fn().mockResolvedValue({ jwt: 'mockJwtToken' });
  
      // logIn 메서드 호출
      const result = await controller.logIn(loginDto, response);
  
      // jwtLogIn 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(authService.jwtLogIn).toHaveBeenCalledWith(loginDto, response);
      
      // 반환된 jwt가 예상한 값인지 확인
      expect(result.jwt).toBe('mockJwtToken');
    });
  });
  

  describe('logOut', () => {
    it('should clear cookie on logout', async () => {
      // Response 객체 mock 설정 (clearCookie 메서드)
      const response = { clearCookie: jest.fn() } as unknown as Response;

      // logOut 메서드 호출
      await controller.logOut(response);

      // clearCookie 메서드가 'jwt'와 함께 호출되었는지 확인
      expect(response.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });

  describe('softDeleteUser', () => {
    it('should call authService.softDeleteUser with correct parameters', async () => {
      const userId = 1;
      const mockUpdateResult = { affected: 1 };

      // AuthService의 softDeleteUser 메서드가 mockResolvedValue로 mockUpdateResult 반환하도록 설정
      authService.softDeleteUser = jest.fn().mockResolvedValue(mockUpdateResult);

      // softDeleteUser 메서드 호출
      const result = await controller.softDeleteUser(userId);

      // softDeleteUser 메서드가 올바른 파라미터로 호출되었는지 확인
      expect(authService.softDeleteUser).toHaveBeenCalledWith(userId);
      // 반환된 결과가 mockUpdateResult와 동일한지 확인
      expect(result).toEqual(mockUpdateResult);
    });
  });
});

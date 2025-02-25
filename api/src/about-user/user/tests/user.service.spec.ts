import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findUserByUserId: jest.fn(),
    findUserWithCategoryByUserId: jest.fn(),
  };

  const mockUserById = {
    createdAt: new Date('2024-12-27T12:52:58.000Z'),
    updatedAt: new Date('2024-12-27T12:52:58.000Z'),
    isUpdated: false,
    deletedAt: null,
    isDeleted: false,
    id: 5,
    email: 'user5@example.com',
    username: 'username5',
    nickname: 'nickname5',
    introduce: '안녕하세요! 저는 유저5입니다.',
    profileImage: 'https://example.com/image5.jpg',
  };

  const mockUserWithCategory = {
    createdAt: new Date('2024-12-27T12:52:58.000Z'),
    id: 5,
    nickname: 'nickname5',
    introduce: '안녕하세요! 저는 유저5입니다.',
    profileImage: 'https://example.com/image5.jpg',
    categories: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByUserId', () => {
    it('should return user details excluding password with createdTimeSince', async () => {
      mockUserRepository.findUserByUserId.mockResolvedValue(mockUserById);

      const result = await userService.findUserById(5);

      expect(result).toEqual({
        createdAt: mockUserById.createdAt,
        createdTimeSince: expect.any(String), // timeSince의 반환값은 무시
        updatedAt: mockUserById.updatedAt,
        isUpdated: false,
        deletedAt: null,
        isDeleted: false,
        id: 5,
        email: 'user5@example.com',
        username: 'username5',
        nickname: 'nickname5',
        introduce: '안녕하세요! 저는 유저5입니다.',
        profileImage: 'https://example.com/image5.jpg',
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith(5);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findUserByUserId.mockResolvedValue(undefined);

      await expect(userService.findUserById(5)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findUserById).toHaveBeenCalledWith(5);
    });
  });

  describe('findUserWithCategoryByUserId', () => {
    it('should return user details with empty categories array and createdTimeSince', async () => {
      mockUserRepository.findUserWithCategoryByUserId.mockResolvedValue(
        mockUserWithCategory,
      );

      const result = await userService.findUserWithCategoryByUserId(5);

      expect(result).toEqual({
        createdAt: mockUserWithCategory.createdAt,
        createdTimeSince: expect.any(String), // timeSince의 반환값은 무시
        id: 5,
        nickname: 'nickname5',
        introduce: '안녕하세요! 저는 유저5입니다.',
        profileImage: 'https://example.com/image5.jpg',
        categories: [],
      });
      expect(userRepository.findUserWithCategoryByUserId).toHaveBeenCalledWith(
        5,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findUserWithCategoryByUserId.mockResolvedValue(
        undefined,
      );

      await expect(userService.findUserWithCategoryByUserId(5)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findUserWithCategoryByUserId).toHaveBeenCalledWith(
        5,
      );
    });
  });
});

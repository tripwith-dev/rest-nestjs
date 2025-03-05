import { Test, TestingModule } from '@nestjs/testing';
import { AvatarLikePlanController } from './avatar-like-plan.controller';

describe('AvatarLikePlanController', () => {
  let controller: AvatarLikePlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarLikePlanController],
    }).compile();

    controller = module.get<AvatarLikePlanController>(AvatarLikePlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

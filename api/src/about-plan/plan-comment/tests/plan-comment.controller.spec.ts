import { Test, TestingModule } from '@nestjs/testing';
import { PlanCommentController } from '../plan-comment.controller';

describe('PlanCommentController', () => {
  let controller: PlanCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanCommentController],
    }).compile();

    controller = module.get<PlanCommentController>(PlanCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PlanDetailController } from '../plan-detail.controller';

describe('PlandetailController', () => {
  let controller: PlanDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanDetailController],
    }).compile();

    controller = module.get<PlanDetailController>(PlanDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PlanDetailService } from '../plandetail.service';

describe('PlandetailService', () => {
  let service: PlanDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanDetailService],
    }).compile();

    service = module.get<PlanDetailService>(PlanDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

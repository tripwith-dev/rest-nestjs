import { Test, TestingModule } from '@nestjs/testing';
import { PlanDestinationService } from './plan-destination.service';

describe('PlanDestinationService', () => {
  let service: PlanDestinationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanDestinationService],
    }).compile();

    service = module.get<PlanDestinationService>(PlanDestinationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

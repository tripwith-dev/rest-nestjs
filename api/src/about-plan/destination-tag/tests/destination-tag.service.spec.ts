import { Test, TestingModule } from '@nestjs/testing';
import { DestinationTagService } from '../destination-tag.service';

describe('DestinationService', () => {
  let service: DestinationTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DestinationTagService],
    }).compile();

    service = module.get<DestinationTagService>(DestinationTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

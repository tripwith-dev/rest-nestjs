import { Test, TestingModule } from '@nestjs/testing';
import { ArticlecommentService } from '../article-comment.service';

describe('ArticlecommentService', () => {
  let service: ArticlecommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlecommentService],
    }).compile();

    service = module.get<ArticlecommentService>(ArticlecommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

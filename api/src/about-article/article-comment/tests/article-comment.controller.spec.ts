import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentController } from '../article-comment.controller';

describe('ArticlecommentController', () => {
  let controller: ArticleCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCommentController],
    }).compile();

    controller = module.get<ArticleCommentController>(ArticleCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

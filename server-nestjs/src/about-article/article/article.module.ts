import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModule } from 'src/about-user/avatar/avatar.module';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), AvatarModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService, ArticleRepository],
})
export class ArticleModule {}

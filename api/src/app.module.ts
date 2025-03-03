import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ArticleCommentModule } from './about-article/article-comment/article-comment.module';
import { ArticleModule } from './about-article/article/article.module';
import { CategoryEntity } from './about-plan/category/category.entity';
import { CategoryModule } from './about-plan/category/category.module';
import { LocationEntity } from './about-plan/location/location.entity';
import { LocationModule } from './about-plan/location/location.module';
import { PlanCommentModule } from './about-plan/plan-comment/plan-comment.module';
import { PlanDetailEntity } from './about-plan/plan-detail/plan-detail.entity';
import { PlanDetailModule } from './about-plan/plan-detail/plan-detail.module';
import { PlanTagMappingEntity } from './about-plan/plan-tag-mapping/plan-tag-mapping.entity';
import { PlanTagMappingModule } from './about-plan/plan-tag-mapping/plan-tag-mapping.module';
import { PlanTagEntity } from './about-plan/plan-tag/plan-tag.entity';
import { PlanTagModule } from './about-plan/plan-tag/plan-tag.module';
import { PlanEntity } from './about-plan/plan/plan.entity';
import { PlanModule } from './about-plan/plan/plan.module';
import { AuthModule } from './about-user/auth/auth.module';
import { AvatarEntity } from './about-user/avatar/avatar.entity';
import { AvatarModule } from './about-user/avatar/avatar.module';
import { UserEntity } from './about-user/user/user.entity';
import { UserModule } from './about-user/user/user.module';
import { AppController } from './app.controller';
import { AvatarLikeArticleModule } from './avatar-like-article/user-like-article.module';
import { AvatarLikePlanEntity } from './avatar-like-plan/avatar-like-plan.entity';
import { AvatarLikePlanModule } from './avatar-like-plan/avatar-like-plan.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // 클라이언트가 접근할 경로
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false, // 배포환경에서는 false
      logging: true,
      entities: [
        UserEntity,
        AvatarEntity,
        CategoryEntity,
        PlanEntity,
        PlanDetailEntity,
        LocationEntity,
        AvatarLikePlanEntity,
        PlanTagEntity,
        PlanTagMappingEntity,
      ],
      autoLoadEntities: true,
    }),
    UserModule,
    CategoryModule,
    AuthModule,
    PlanTagModule,
    PlanTagMappingModule,
    PlanModule,
    PlanDetailModule,
    AvatarLikePlanModule,
    PlanCommentModule,
    ArticleModule,
    ArticleCommentModule,
    AvatarLikeArticleModule,
    AvatarModule,
    LocationModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 소비자에게 LoggerMiddleware 제공, 전체 엔드포인트에 대해서 LoggerMiddleware 실행
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

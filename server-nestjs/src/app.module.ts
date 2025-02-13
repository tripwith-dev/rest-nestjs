import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ArticleModule } from './about-article/article/article.module';
import { ArticleCommentModule } from './about-article/articlecomment/articlecomment.module';
import { CategoryEntity } from './about-plan/category/category.entity';
import { CategoryModule } from './about-plan/category/category.module';
import { DestinationModule } from './about-plan/destination/destination.module';
import { PlanDestinationModule } from './about-plan/plan-destination/plan-destination.module';
import { PlanModule } from './about-plan/plan/plan.module';
import { PlanCommentModule } from './about-plan/plancomment/plancomment.module';
import { PlanDetailModule } from './about-plan/plandetail/plandetail.module';
import { AuthModule } from './about-user/auth/auth.module';
import { AvatarController } from './about-user/avatar/avatar.controller';
import { AvatarEntity } from './about-user/avatar/avatar.entity';
import { AvatarModule } from './about-user/avatar/avatar.module';
import { UserEntity } from './about-user/user/user.entity';
import { UserModule } from './about-user/user/user.module';
import { AppController } from './app.controller';
import { AvatarLikeArticleModule } from './avatar-like-article/user-like-article.module';
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
      synchronize: true, // 배포환경에서는 false
      logging: true,
      entities: [UserEntity, AvatarEntity, CategoryEntity],
      autoLoadEntities: true,
    }),
    UserModule,
    CategoryModule,
    AuthModule,
    DestinationModule,
    PlanDestinationModule,
    PlanModule,
    PlanDetailModule,
    AvatarLikePlanModule,
    PlanCommentModule,
    ArticleModule,
    ArticleCommentModule,
    AvatarLikeArticleModule,
    AvatarModule,
  ],
  controllers: [AppController, AvatarController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 소비자에게 LoggerMiddleware 제공, 전체 엔드포인트에 대해서 LoggerMiddleware 실행
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './about-article/article/article.module';
import { ArticlecommentModule } from './about-article/articlecomment/articlecomment.module';
import { CategoryEntity } from './about-plan/category/category.entity';
import { CategoryModule } from './about-plan/category/category.module';
import { DestinationModule } from './about-plan/destination/destination.module';
import { PlanDestinationModule } from './about-plan/plan-destination/plan-destination.module';
import { PlanModule } from './about-plan/plan/plan.module';
import { PlanCommentModule } from './about-plan/plancomment/plancomment.module';
import { PlanDetailModule } from './about-plan/plandetail/plandetail.module';
import { AuthModule } from './about-user/auth/auth.module';
import { SettingsModule } from './about-user/settings/settings.module';
import { UserEntity } from './about-user/user/user.entity';
import { UserModule } from './about-user/user/user.module';
import { AppController } from './app.controller';
import { UserLikeArticleModule } from './user-like-article/user-like-article.module';
import { UserLikePlanModule } from './user-like-plan/user-like-plan.module';
import { CategoryController } from './category/category.controller';

@Module({
  imports: [
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
      entities: [UserEntity, CategoryEntity],
      autoLoadEntities: true,
    }),
    UserModule,
    CategoryModule,
    AuthModule,
    DestinationModule,
    PlanDestinationModule,
    SettingsModule,
    PlanModule,
    PlanDetailModule,
    UserLikePlanModule,
    PlanCommentModule,
    ArticleModule,
    ArticlecommentModule,
    UserLikeArticleModule,
  ],
  controllers: [AppController, CategoryController],
})
export class AppModule {}

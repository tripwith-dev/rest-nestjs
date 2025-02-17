import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AvatarLikePlanModule } from 'src/avatar-like-plan/avatar-like-plan.module';
import { CategoryModule } from '../category/category.module';
import { DestinationModule } from '../destination/destination.module';
import { PlanDestinationModule } from '../plan-destination/plan-destination.module';
import { PlanController } from './plan.controller';
import { PlanEntity } from './plan.entity';
import { PlanRepository } from './plan.repository';
import { PlanService } from './plan.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/planImages',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    TypeOrmModule.forFeature([PlanEntity]),
    CategoryModule,
    DestinationModule,
    PlanDestinationModule,
    AvatarLikePlanModule,
  ],
  controllers: [PlanController],
  providers: [PlanService, PlanRepository],
  exports: [PlanService, PlanRepository],
})
export class PlanModule {}

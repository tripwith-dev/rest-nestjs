import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AvatarController } from './avatar.controller';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { AvatarService } from './avatar.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/profileImages',
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
    TypeOrmModule.forFeature([AvatarEntity, AvatarRepository]),
  ],
  controllers: [AvatarController],
  providers: [AvatarService, AvatarRepository],
  exports: [AvatarService, AvatarRepository],
})
export class AvatarModule {}

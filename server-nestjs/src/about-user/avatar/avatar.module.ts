import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { AvatarService } from './avatar.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = join(__dirname, './uploads/profileImages');
          // 로그로 디렉토리 경로 확인
          console.log('업로드 디렉토리:', uploadDir);
          cb(null, uploadDir);
        },
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
  providers: [AvatarService, AvatarRepository],
  exports: [AvatarService, AvatarRepository],
})
export class AvatarModule {}

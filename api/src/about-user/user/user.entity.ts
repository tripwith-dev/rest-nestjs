import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AvatarEntity } from '../avatar/avatar.entity';

@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // softDelete 후 새로 생성할 때 unique: true 설정 시 에러 발생
  // 중복 체크 따로 해줄거임
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, length: 30 })
  username: string;

  @Column({ default: false })
  admin: boolean;

  @OneToOne(() => AvatarEntity, (avatar) => avatar.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;
}

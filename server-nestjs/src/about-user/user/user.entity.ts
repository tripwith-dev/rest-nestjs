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

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, length: 30 })
  username: string;

  @OneToOne(() => AvatarEntity, (avatar) => avatar.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;
}

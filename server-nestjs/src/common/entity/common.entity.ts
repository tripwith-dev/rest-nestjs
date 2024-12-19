import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  createdTimeSince?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isUpdated: boolean;

  // Soft Delete : default는 null, 삭제 시에 timestamp
  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @Column({ default: false })
  isDeleted: boolean;
}

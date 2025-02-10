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

  @Exclude()
  @DeleteDateColumn({ select: false })
  deletedAt?: Date | null;

  @Column({ default: false, select: false })
  isDeleted: boolean;
}

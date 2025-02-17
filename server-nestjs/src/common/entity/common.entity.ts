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

import { CategoryEntity } from 'src/category/category.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn() // 자동으로 NOT NULL 포함
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, length: 30 })
  username: string;

  @Column({ nullable: false, unique: true, length: 20 })
  nickname: string;

  @Column({ nullable: true })
  introduce: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories: CategoryEntity[];
}

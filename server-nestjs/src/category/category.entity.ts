import { CommonEntity } from 'src/common/entity/common.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('category') // db에 저장될 테이블 이름
export class CategoryEntity extends CommonEntity {
  @PrimaryColumn() // 자동으로 NOT NULL 포함
  categoryId: number; //카테고리ID

  @Column({ nullable: false})
  categoryTitle: string;

  @ManyToOne(()=> UserEntity, (user)=> user.categories)
  @JoinColumn({name: 'userId' })
  user: UserEntity;
}

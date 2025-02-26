import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanCommentEntity } from './plan-comment.entity';

@Injectable()
export class PlanCommentRepository {
  constructor(
    @InjectRepository(PlanCommentEntity)
    private readonly repository: Repository<PlanCommentEntity>,
  ) {}
}

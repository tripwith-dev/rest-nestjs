import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlanService } from '../plan/plan.service';
import { CreatePlanDetailDto } from './dtos/plandetail.create.dto';
import { UpdatePlanDetailDto } from './dtos/plandetail.update.dto';
import { PlanDetailEntity } from './plandetail.entity';
import { PlanDetailRepository } from './plandetail.repository';

@Injectable()
export class PlanDetailService {
  constructor(
    private readonly planDetailRepository: PlanDetailRepository,
    private readonly planService: PlanService,
  ) {}

  async createPlanDetail(
    planId: number,
    createPlanDetailDto: CreatePlanDetailDto,
  ): Promise<PlanDetailEntity> {
    const plan = await this.planService.findPlanById(planId);

    // startTime과 endTime 비교
    if (createPlanDetailDto.endTime <= createPlanDetailDto.startTime) {
      throw new BadRequestException(
        'startTime이 endTime과 같거나 보다 느릴 수 없습니다.',
      );
    }

    // 중복된 시간의 트래블 디테일 삭제
    await this.deleteOverlap(
      planId,
      createPlanDetailDto.startTime,
      createPlanDetailDto.endTime,
    );

    console.log(plan);
    const newDetail = await this.planDetailRepository.createPlanDetail(
      plan,
      createPlanDetailDto,
    );
    console.log(newDetail);

    // 총 비용 갱신
    await this.planService.updateTotalExpenses(planId);

    return newDetail;
  }

  async deleteOverlap(
    planId: number,
    startTime: string,
    endTime: string,
    excludeDetailId?: number,
  ) {
    const overlappingDetails = await this.findOverlap(
      planId,
      startTime,
      endTime,
      excludeDetailId,
    );
    return await this.planDetailRepository.deleteOverlap(overlappingDetails);
  }

  async findAllPlanDetails(): Promise<PlanDetailEntity[]> {
    return await this.planDetailRepository.findAllPlanDetails();
  }

  async findOverlap(
    planId: number,
    startTime: string,
    endTime: string,
    excludeDetailId?: number,
  ) {
    return await this.planDetailRepository.findOverlap(
      planId,
      startTime,
      endTime,
      excludeDetailId,
    );
  }

  async findPlanDetailById(detailId: number): Promise<PlanDetailEntity> {
    const detail = await this.planDetailRepository.findPlanDetailById(detailId);
    if (!detail) {
      throw new NotFoundException(
        `${detailId}에 해당하는 detail을 찾을 수 없습니다.`,
      );
    }
    return detail;
  }

  async updateTravelDetail(
    detailId: number,
    updateTravelDetailDto: UpdatePlanDetailDto,
  ): Promise<PlanDetailEntity> {
    const detail = await this.findPlanDetailById(detailId);

    // startTime과 endTime 비교
    if (updateTravelDetailDto.endTime <= updateTravelDetailDto.startTime) {
      throw new BadRequestException(
        'startTime이 endTime과 같거나 보다 느릴 수 없습니다.',
      );
    }

    // 중복된 시간의 트래블 디테일 삭제
    await this.deleteOverlap(
      detail.plan.planId,
      updateTravelDetailDto.startTime,
      updateTravelDetailDto.endTime,
      detailId,
    );

    await this.planDetailRepository.updateTravelDetail(
      detailId,
      updateTravelDetailDto,
    );

    // 총 비용 갱신
    await this.planService.updateTotalExpenses(detail.plan.planId);

    return await this.findPlanDetailById(detailId);
  }

  async softDeletePlanDetail(detailId: number): Promise<void> {
    const detail = await this.findPlanDetailById(detailId);
    if (!detail) {
      throw new NotFoundException(
        `${detailId}의 세부 계획을 찾을 수 없습니다.`,
      );
    }
    await this.planDetailRepository.softDeletePlanDetail(detailId);

    // 총 비용 갱신
    await this.planService.updateTotalExpenses(detail.plan.planId);
  }

  async confirmTimeOverlap(planId: number, startTime: string, endTime: string) {
    const overlappingDetails = await this.planDetailRepository.findOverlap(
      planId,
      startTime,
      endTime,
    );
    return overlappingDetails.length > 0 ? true : false;
  }

  @Cron('0 0 * * *') // 매일 자정에 실행
  async hardDeleteOldSoftDeletedDetails(): Promise<void> {
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - 1); // 1개월 이상된 데이터 삭제

    await this.planDetailRepository.deleteIsDeletedTrue(thresholdDate);
  }
}

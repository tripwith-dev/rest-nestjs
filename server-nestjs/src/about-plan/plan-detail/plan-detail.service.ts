import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlanService } from '../plan/plan.service';
import { CreatePlanDetailDto } from './dtos/plandetail.create.dto';
import { UpdatePlanDetailDto } from './dtos/plandetail.update.dto';
import { PlanDetailEntity } from './plan-detail.entity';
import { PlanDetailRepository } from './plan-detail.repository';

@Injectable()
export class PlanDetailService {
  constructor(
    private readonly planDetailRepository: PlanDetailRepository,
    private readonly planService: PlanService,
  ) {}

  /**
   * 특정 여행 계획(plan)에 대한 상세 계획(planDetail)을 생성하는 함수.
   *
   * 1. `planId`를 기반으로 해당 플랜을 조회한다.
   * 2. `startTime`과 `endTime`이 유효한지 검사한다.
   * 3. 겹치는 시간대의 기존 상세 계획을 삭제한다.
   * 4. 새로운 상세 계획을 생성한다.
   * 5. 플랜의 총 비용을 갱신한다.
   *
   * @param planId - 상세 계획을 추가할 대상 플랜의 ID
   * @param createPlanDetailDto - 생성할 상세 계획의 정보 (startTime, endTime 등)
   * @returns 생성된 PlanDetailEntity 객체
   * @throws BadRequestException - startTime이 endTime보다 같거나 클 경우 예외 발생
   */
  async createPlanDetail(
    planId: number,
    createPlanDetailDto: CreatePlanDetailDto,
  ): Promise<PlanDetailEntity> {
    const plan = await this.planService.findPlanById(planId);
    this.validateTimeRange(
      createPlanDetailDto.startTime,
      createPlanDetailDto.endTime,
    );
    await this.deleteOverlap(
      planId,
      createPlanDetailDto.startTime,
      createPlanDetailDto.endTime,
    );

    const newDetail = await this.planDetailRepository.createPlanDetail(
      plan,
      createPlanDetailDto,
    );
    await this.planService.updateTotalExpenses(planId);

    return newDetail;
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    if (endTime <= startTime) {
      throw new BadRequestException(
        'startTime이 endTime과 같거나 보다 느릴 수 없습니다.',
      );
    }
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

  async isPlanDetailOwner(
    detailId: number,
    avatarId: number,
  ): Promise<boolean> {
    const detail = await this.findPlanDetailOwnerByDetailId(detailId);
    return detail.plan.category.avatar.avatarId === avatarId;
  }

  async findPlanDetailOwnerByDetailId(
    detailId: number,
  ): Promise<PlanDetailEntity> {
    const detail =
      await this.planDetailRepository.findPlanDetailOwnerByDetailId(detailId);
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

    this.validateTimeRange(
      updateTravelDetailDto.startTime,
      updateTravelDetailDto.endTime,
    );

    // 중복된 시간의 트래블 디테일 삭제
    await this.deleteOverlap(
      detail.plan.planId,
      updateTravelDetailDto.startTime,
      updateTravelDetailDto.endTime,
      detailId, // update할 detail은 삭제 목록에서 제외
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

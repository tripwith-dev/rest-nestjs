import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationEntity } from '../location/location.entity';
import { LocationService } from '../location/location.service';
import { PlanService } from '../plan/plan.service';
import { CreateDetailWithLocationDto } from './dtos/plandetail.withLocation..create.dto';
import { UpdateDetailWithLocationDto } from './dtos/plandetail.withLocation.update.dto';
import { PlanDetailEntity } from './plan-detail.entity';
import { PlanDetailRepository } from './plan-detail.repository';

@Injectable()
export class PlanDetailService {
  constructor(
    private readonly planDetailRepository: PlanDetailRepository,
    private readonly planService: PlanService,
    private readonly locationService: LocationService,
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
    createDetailWithLocationDto: CreateDetailWithLocationDto,
  ): Promise<PlanDetailEntity> {
    const plan = await this.planService.findPlanById(planId);
    this.validateTimeRange(
      createDetailWithLocationDto.createDetailDto.startTime,
      createDetailWithLocationDto.createDetailDto.endTime,
    );
    await this.deleteOverlap(
      planId,
      createDetailWithLocationDto.createDetailDto.startTime,
      createDetailWithLocationDto.createDetailDto.endTime,
    );

    const newDetail = await this.planDetailRepository.createPlanDetail(
      plan,
      createDetailWithLocationDto.createDetailDto,
    );
    await this.planService.updateTotalPrice(planId);

    if (createDetailWithLocationDto.createLocationDto) {
      // createLocation 함수 내부에서 location이 존재하는 지 확인 후
      // 이미 존재하면 만들지 않음
      const location = await this.locationService.createLocation(
        createDetailWithLocationDto.createLocationDto,
      );
      await this.updateDetailLocation(newDetail.detailId, location);
    }

    return newDetail;
  }

  async updateDetailLocation(detailId: number, location: LocationEntity) {
    console.log(location);
    return await this.planDetailRepository.updateDetailLocation(
      detailId,
      location,
    );
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
    updateDetailWithLocationDto: UpdateDetailWithLocationDto,
  ): Promise<PlanDetailEntity> {
    const detail = await this.findPlanDetailById(detailId);

    this.validateTimeRange(
      updateDetailWithLocationDto.updateDetailDto.startTime,
      updateDetailWithLocationDto.updateDetailDto.endTime,
    );

    // 중복된 시간의 트래블 디테일 삭제
    await this.deleteOverlap(
      detail.plan.planId,
      updateDetailWithLocationDto.updateDetailDto.startTime,
      updateDetailWithLocationDto.updateDetailDto.endTime,
      detailId, // update할 detail은 삭제 목록에서 제외
    );

    await this.planDetailRepository.updateTravelDetail(
      detailId,
      updateDetailWithLocationDto.updateDetailDto,
    );

    // 총 비용 갱신
    await this.planService.updateTotalPrice(detail.plan.planId);

    if (updateDetailWithLocationDto.createLocationDto.address) {
      // createLocation 함수 내부에서 location이 존재하는 지 확인 후
      // 이미 존재하면 만들지 않음
      const location = await this.locationService.createLocation(
        updateDetailWithLocationDto.createLocationDto,
      );
      await this.updateDetailLocation(detailId, location);
      return await this.findPlanDetailById(detailId);
    }

    // locationName이 존재하지 않으면 주소를 삭제한 것이므로 null로 갱신
    await this.updateDetailLocation(detailId, null);
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
    await this.planService.updateTotalPrice(detail.plan.planId);
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

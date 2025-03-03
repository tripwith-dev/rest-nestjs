import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Status } from 'src/common/enum/status';
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

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

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
    // 1. plan 존재 여부 확인
    const plan = await this.planService.findPlanById(planId);

    // 2. 시간 범위 검증
    this.validateTimeRange(
      createDetailWithLocationDto.createDetailDto.startTime,
      createDetailWithLocationDto.createDetailDto.endTime,
    );

    // 3. 시간 범위가 겹치는 detail은 삭제
    await this.deleteOverlap(
      planId,
      createDetailWithLocationDto.createDetailDto.startTime,
      createDetailWithLocationDto.createDetailDto.endTime,
    );

    // 4. 새로운 detail 생성
    const newDetail = await this.planDetailRepository.createPlanDetail(
      plan,
      createDetailWithLocationDto.createDetailDto,
    );

    // 5. plan의 total price 업데이트
    await this.planService.updateTotalPrice(planId);

    // 6. 위치정보를 추가 할 경우 location을 생성 후 연결
    // createLocation는 이미 location 정보가 있을 경우 생성하지 않음
    if (createDetailWithLocationDto.createLocationDto) {
      const location = await this.locationService.createLocation(
        createDetailWithLocationDto.createLocationDto,
      );
      await this.updateDetailLocation(newDetail.detailId, location);
    }

    return newDetail;
  }

  /**
   *
   * @param detailId
   * @returns
   */
  async findPlanDetailById(detailId: number): Promise<PlanDetailEntity> {
    const detail = await this.planDetailRepository.findPlanDetailById(detailId);
    if (!detail) {
      throw new NotFoundException(
        `${detailId}에 해당하는 detail을 찾을 수 없습니다.`,
      );
    }
    return detail;
  }

  /**
   *
   * @param detailId
   * @param updateDetailWithLocationDto
   * @returns
   */
  async updateTravelDetail(
    detailId: number,
    updateDetailWithLocationDto: UpdateDetailWithLocationDto,
  ): Promise<PlanDetailEntity> {
    // 1. detail 존재 여부 확인
    const detail = await this.findPlanDetailById(detailId);

    // 2. 시간 범위 검증
    this.validateTimeRange(
      updateDetailWithLocationDto.updateDetailDto.startTime,
      updateDetailWithLocationDto.updateDetailDto.endTime,
    );

    // 3. 시간 범위가 겹치는 detail은 삭제
    await this.deleteOverlap(
      detail.plan.planId,
      updateDetailWithLocationDto.updateDetailDto.startTime,
      updateDetailWithLocationDto.updateDetailDto.endTime,
      detailId, // update할 detail은 삭제 목록에서 제외
    );

    // 4. detail 업데이트
    await this.planDetailRepository.updateTravelDetail(
      detailId,
      updateDetailWithLocationDto.updateDetailDto,
    );

    // 5. plan의 total price 업데이트
    await this.planService.updateTotalPrice(detail.plan.planId);

    // 6. 위치정보를 업데이트 할 경우 location을 생성 후 업데이트
    // createLocation는 이미 location 정보가 있을 경우 생성하지 않음
    if (updateDetailWithLocationDto.createLocationDto.address) {
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

  /**
   *
   * @param detailId
   */
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

  /**
   *
   * @param planId
   * @param startTime
   * @param endTime
   * @returns
   */
  async confirmTimeOverlap(planId: number, startTime: string, endTime: string) {
    const overlappingDetails = await this.planDetailRepository.findOverlap(
      planId,
      startTime,
      endTime,
    );
    return overlappingDetails.length > 0 ? true : false;
  }

  async isOwner(detailId: number, avatarId: number): Promise<boolean> {
    const detail = await this.findPlanDetailOwnerByDetailId(detailId);
    return detail.plan.avatar.avatarId === avatarId;
  }

  async isAccessible(detailId: number, avatarId: number): Promise<boolean> {
    const detail = await this.findPlanDetailOwnerByDetailId(detailId);
    return (
      detail.plan.status === Status.PUBLIC ||
      detail.plan.avatar.avatarId === avatarId
    );
  }

  // ===========================================================
  // =========================== SUB ===========================
  // ===========================================================

  async updateDetailLocation(detailId: number, location: LocationEntity) {
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

  @Cron('0 0 * * *') // 매일 자정에 실행
  async hardDeleteOldSoftDeletedDetails(): Promise<void> {
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - 1); // 1개월 이상된 데이터 삭제

    await this.planDetailRepository.deleteIsDeletedTrue(thresholdDate);
  }
}

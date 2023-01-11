import { Injectable } from '@nestjs/common';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UserEnrolledEvent } from '@modules/event/infrastructure/events/user-enrolled.event';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { CreatePerformanceOnProgramSettingsUpdatedEvent } from '@modules/event/infrastructure/events/create-performance-on-program-settings-updated.event';
import { MailDeliveryEventHandler } from '@modules/messenger/application/mail-delivery.event-handler';

@Injectable()
export class EducationRequestAcceptEventHandler {
  constructor(
    private createPerformanceService: CreatePerformanceService,
    private mailDeliveryEventHandler: MailDeliveryEventHandler
  ) {}

  @OnEvent(EventActionEnum.ENROLLED, { async: true })
  async handleEnrolled(payload: UserEnrolledEvent) {
    await this.createPerformance(payload);
  }

  @OnEvent(EventActionEnum.SELF_ENROLLED, { async: true })
  async handleSelfEnrolled(payload: UserEnrolledEvent) {
    await this.createPerformance(payload);
    await this.mailDeliveryEventHandler.sendMessage({ educationElementId: payload.educationElementId, userId: payload.userId })
  }

  @OnEvent(EventActionEnum.EDUCATION_REQUEST_ACCEPT, { async: true })
  async handleEducationRequestAccept(payload: EducationRequestAcceptEvent) {
    await this.createPerformance(payload);
  }

  @OnEvent(EventActionEnum.CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED, {
    async: true,
  })
  async handleCreatePerformanceOnObligatoryUpdated(payload: CreatePerformanceOnProgramSettingsUpdatedEvent) {
    await this.createPerformance(payload);
  }

  private async createPerformance({
    userId,
    educationElementId,
    educationElementType,
    assignmentId,
  }: EducationRequestAcceptEvent | UserEnrolledEvent) {
    switch (educationElementType) {
      case EducationElementTypeEnum.TEST:
        await this.createPerformanceService.createTestPerformance({
          testId: educationElementId,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
      case EducationElementTypeEnum.COURSE:
        await this.createPerformanceService.createCoursePerformance({
          courseId: educationElementId,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
      case EducationElementTypeEnum.PROGRAM:
        await this.createPerformanceService.createEducationProgramPerformance({
          educationProgramId: educationElementId,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
    }
  }
}

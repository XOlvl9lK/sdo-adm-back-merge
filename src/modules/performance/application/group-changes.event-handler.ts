import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import {
  EducationElementEntity,
  EducationElementTypeEnum
} from '@modules/education-program/domain/education-element.entity';
import { GroupChangesEvent, GroupChangesTypeEnum } from '@modules/event/infrastructure/events/group-changes.event';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceRepository } from '@modules/performance/infrastructure/database/performance.repository';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import {
  CoursePerformanceEntity,
  PerformanceEntity,
  TestPerformanceEntity
} from '@modules/performance/domain/performance.entity';
import { AttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';

export class GroupChangesEventHandler {
  constructor(
    private createPerformanceService: CreatePerformanceService,
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    @InjectRepository(AttemptRepository)
    private attemptRepository: AttemptRepository
  ) {}

  @OnEvent(EventActionEnum.GROUP_CHANGES, { async: true })
  async handleGroupChangesEvent({ groupId, userIds, type }: GroupChangesEvent) {
    const assignments = await this.assignmentRepository.findByGroupId(groupId)
    if (type === GroupChangesTypeEnum.ADD) {
      await Promise.all(
        assignments.map(
          assignment => Promise.all(
            userIds.map(userId => this.createPerformance(userId, assignment.educationElement, assignment.id))
          )
        )
      )
    } else {
      const performances = await this.performanceRepository.findByAssignmentIdsAndUserIds(
        assignments.map(assignment => assignment.id),
        userIds
      )
      const programElementPerformances = await this.performanceRepository.findByParentPerformanceIds(performances.map(p => p.id))
      await this.removePerformances([...performances, ...programElementPerformances] as (TestPerformanceEntity | CoursePerformanceEntity)[])
    }
  }

  private async createPerformance(userId: string, educationElement: EducationElementEntity, assignmentId: string) {
    switch (educationElement.elementType) {
      case EducationElementTypeEnum.TEST:
        await this.createPerformanceService.createTestPerformance({
          testId: educationElement.id,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
      case EducationElementTypeEnum.COURSE:
        await this.createPerformanceService.createCoursePerformance({
          courseId: educationElement.id,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
      case EducationElementTypeEnum.PROGRAM:
        await this.createPerformanceService.createEducationProgramPerformance({
          educationProgramId: educationElement.id,
          userId,
          attemptsLeft: 5,
          assignmentId,
        });
        break;
    }
  }

  private async removePerformances(performances: (TestPerformanceEntity | CoursePerformanceEntity)[]) {
    const attempts = await this.attemptRepository.findByPerformanceIds(performances.map(p => p.id))
    await this.attemptRepository.remove(attempts)
    await this.performanceRepository.remove(performances)
  }
}
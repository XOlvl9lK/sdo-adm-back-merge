import { Injectable } from '@nestjs/common';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { CreatePerformanceService } from '@modules/performance/application/create-performance.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { GroupEnrolledEvent } from '@modules/event/infrastructure/events/group-enrolled.event';

@Injectable()
export class EducationRequestGroupEnrollEventHandler {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    private createPerformanceService: CreatePerformanceService,
  ) {}

  @OnEvent(EventActionEnum.GROUP_ENROLLED, { async: true })
  async handle({ educationElementId, groupId, assignmentId, educationElementType }: GroupEnrolledEvent) {
    const group = await this.groupRepository.findById(groupId);
    if (group?.users.length) {
      switch (educationElementType) {
        case EducationElementTypeEnum.TEST:
          await Promise.all(
            group.users.map(userInGroup => {
              return this.createPerformanceService.createTestPerformance({
                testId: educationElementId,
                userId: userInGroup.user.id,
                attemptsLeft: 5,
                assignmentId,
              });
            }),
          );
          break;
        case EducationElementTypeEnum.PROGRAM:
          await Promise.all(
            group.users.map(userInGroup => {
              return this.createPerformanceService.createEducationProgramPerformance({
                educationProgramId: educationElementId,
                userId: userInGroup.user.id,
                attemptsLeft: 5,
                assignmentId,
              });
            }),
          );
          break;
        case EducationElementTypeEnum.COURSE:
          await Promise.all(
            group.users.map(userInGroup => {
              return this.createPerformanceService.createCoursePerformance({
                courseId: educationElementId,
                userId: userInGroup.user.id,
                attemptsLeft: 5,
                assignmentId,
              });
            }),
          );
          break;
      }
    }
  }
}

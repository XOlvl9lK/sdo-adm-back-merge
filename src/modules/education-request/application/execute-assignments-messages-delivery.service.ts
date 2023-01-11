import { Injectable } from '@nestjs/common';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { each, find, reduce } from 'lodash';
import { DeliverAssignmentsMessagesEvent } from '@modules/event/infrastructure/events/deliver-assignments-messages.event';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';

@Injectable()
export class ExecuteAssignmentsMessagesDeliveryService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(assignments: AssignmentEntity[]) {
    const groupedEducationElementIdsByUsers = reduce<AssignmentEntity, DeliverAssignmentsMessagesEvent[]>(
      assignments,
      (result, assignment) => {
        const inResult = find(result, r => r.userId === assignment?.user?.id);
        if (inResult) {
          inResult.assignments.push(assignment);
        } else {
          result.push({
            userId: assignment?.user?.id,
            assignments: [assignment],
          });
        }
        return result;
      },
      [],
    );
    await this.eventEmitter.emitAsync(EventActionEnum.DELIVER_ASSIGNMENTS_MESSAGES, groupedEducationElementIdsByUsers);
  }

  async executeForGroup(assignments: AssignmentEntity[]) {
    const groupedEducationElementIdsByGroups = reduce<
      AssignmentEntity,
      { groupId: string; assignments: AssignmentEntity[] }[]
    >(
      assignments,
      (result, assignment) => {
        const inResult = find(result, r => r.groupId === assignment?.group?.id);
        if (inResult) {
          inResult.assignments.push(assignment);
        } else {
          result.push({
            groupId: assignment?.group?.id,
            assignments: [assignment],
          });
        }
        return result;
      },
      [],
    );
    await Promise.all(groupedEducationElementIdsByGroups.map((grouped) => {
      return this.groupRepository.findById(grouped?.groupId)
        .then(group => {
          if (group) {
            const userIds = group.users.map(userInGroup => userInGroup.user.id);
            return this.eventEmitter.emitAsync(
              EventActionEnum.DELIVER_ASSIGNMENTS_MESSAGES,
              userIds.map(
                userId => new DeliverAssignmentsMessagesEvent(grouped.assignments, userId),
              ),
            )
          }
        })
    }))
  }
}

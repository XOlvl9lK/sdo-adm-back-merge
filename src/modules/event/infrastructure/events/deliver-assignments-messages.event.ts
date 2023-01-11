import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';

export class DeliverAssignmentsMessagesEvent {
  constructor(public assignments: AssignmentEntity[], public userId: string) {}
}

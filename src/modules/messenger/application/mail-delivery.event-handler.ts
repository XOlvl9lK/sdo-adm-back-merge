import { Injectable } from '@nestjs/common';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { sdoId } from '@modules/user/infrastructure/database/user.repository';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { CreatePerformanceOnProgramSettingsUpdatedEvent } from '@modules/event/infrastructure/events/create-performance-on-program-settings-updated.event';
import { DeliverAssignmentsMessagesEvent } from '@modules/event/infrastructure/events/deliver-assignments-messages.event';
import { each } from 'lodash';
import { getElementTypeName } from '@core/libs/getElementTypeName';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { format } from 'date-fns';

const theme = 'Вы зачислены на обучение';

export const getContentTemplate = (elementType: string, elementTitle: string) => `
  <p>Добрый день.</p>
  <br />
  <p>Вы зачислены на изучение следующих элементов обучения</p>
  <br />
  <ul>
    <li>${elementType} "${elementTitle}"</li>
  </ul>
  <p>Успешного обучения!</p>
`;

export const getContentTemplateGrouped = (assignments: AssignmentEntity[]) => {
  let list = '';
  each(assignments, assignment => {
    const elementTypeTitle = getElementTypeName(assignment.educationElement.elementType);
    list += `<li>${elementTypeTitle} "${assignment.educationElement.title}"</li>`;
  });
  const startDate = assignments[0]?.startDate;
  return `
    <p>Добрый день.</p>
    <br />
    <p>Вы зачислены на изучение следующих элементов обучения</p>
    <br />
    <ul>
      ${list}
    </ul>
    ${startDate ? `<p>Начало действия: ${format(startDate, 'dd.MM.yyyy')}</p>` : ''}
    <br />
    <p>Успешного обучения!</p>
  `;
};

@Injectable()
export class MailDeliveryEventHandler {
  constructor(
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    private createMessageService: CreateMessageService,
  ) {}

  @OnEvent(EventActionEnum.DELIVER_ASSIGNMENTS_MESSAGES, { async: true })
  async handleEnrolled(payload: DeliverAssignmentsMessagesEvent[]) {
    each(payload, p => {
      this.sendGroupedMessage(p);
    });
  }

  @OnEvent(EventActionEnum.CREATE_PERFORMANCE_ON_PROGRAM_SETTINGS_UPDATED, {
    async: true,
  })
  async handleCreatePerformanceOnObligatoryUpdated({
    userId,
    educationElementId,
  }: CreatePerformanceOnProgramSettingsUpdatedEvent) {
    await this.sendMessage({ educationElementId, userId });
  }

  async sendMessage({ educationElementId, userId }: { educationElementId: string; userId: string }) {
    const educationElement = await this.educationElementRepository.findById(educationElementId);
    const elementTypeTitle = getElementTypeName(educationElement.elementType);
    await this.createMessageService.sendMessage({
      theme,
      content: getContentTemplate(elementTypeTitle, educationElement.title),
      receiverId: userId,
      senderId: sdoId,
    });
  }

  private async sendGroupedMessage({ assignments, userId }: { assignments: AssignmentEntity[]; userId: string }) {
    await this.createMessageService.sendMessage({
      theme,
      content: getContentTemplateGrouped(assignments),
      receiverId: userId,
      senderId: sdoId,
    });
  }
}

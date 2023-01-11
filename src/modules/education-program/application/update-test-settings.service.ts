import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';
import { UpdateTestSettingsDto } from '@modules/education-program/controllers/dtos/update-test-settings.dto';
import { SettingsException } from '@modules/education-program/infrastructure/exceptions/settings.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';

@Injectable()
export class UpdateTestSettingsService {
  constructor(
    @InjectRepository(TestSettingsRepository)
    private testSettingsRepository: TestSettingsRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, assignmentId, ...data }: UpdateTestSettingsDto, userId: string) {
    const [testSettings, assignment] = await Promise.all([
      this.testSettingsRepository.findById(id),
      this.assignmentRepository.findById(assignmentId),
    ]);
    if (!testSettings) SettingsException.NotFound();
    testSettings.update(
      data.timeLimit,
      data.numberOfAttempts,
      data.questionDeliveryFormat,
      data.questionSelectionType,
      data.questionMixingType,
      data.answerMixingType,
      data.isCorrectAnswersAvailable,
      data.maxScore,
      data.passingScore,
      data.isObligatory,
      data?.correctAnswersAvailableDate ? new Date(data.correctAnswersAvailableDate) : null,
      data?.startDate,
      data?.endDate,
    );
    if (assignment) {
      assignment.update(data.startDate, data.endDate, data.isObligatory, data.certificateIssuance);
      await this.assignmentRepository.save(assignment);
    }
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('настройки теста', userId, 'Программы обучения', testSettings),
    );
    return await this.testSettingsRepository.save(testSettings);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramSettingsRepository } from '@modules/education-program/infrastructure/database/education-program-settings.repository';
import { UpdateEducationProgramSettingsDto } from '@modules/education-program/controllers/dtos/update-education-program-settings.dto';
import { SettingsException } from '@modules/education-program/infrastructure/exceptions/settings.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';

@Injectable()
export class UpdateEducationProgramSettingsService {
  constructor(
    @InjectRepository(EducationProgramSettingsRepository)
    private educationProgramSettingsRepository: EducationProgramSettingsRepository,
    @InjectRepository(AssignmentRepository)
    private assignmentRepository: AssignmentRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update(
    {
      id,
      orderOfStudy,
      startDate,
      endDate,
      assignmentId,
      isObligatory,
      certificateIssuance,
    }: UpdateEducationProgramSettingsDto,
    userId: string,
  ) {
    const [educationProgramSettings, assignment] = await Promise.all([
      this.educationProgramSettingsRepository.findById(id),
      this.assignmentRepository.findById(assignmentId),
    ]);
    if (!educationProgramSettings) SettingsException.NotFound();
    educationProgramSettings.update(orderOfStudy, startDate, endDate, isObligatory);
    if (assignment) {
      assignment.update(startDate, endDate, isObligatory, certificateIssuance);
      await this.assignmentRepository.save(assignment);
    }
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('настройки программы обучения', userId, 'Зачисления', educationProgramSettings),
    );
    return await this.educationProgramSettingsRepository.save(educationProgramSettings);
  }
}

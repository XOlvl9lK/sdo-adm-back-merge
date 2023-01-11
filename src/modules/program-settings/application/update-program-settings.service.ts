import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { UpdateProgramSettingsDto } from '@modules/program-settings/controllers/dtos/update-program-settings.dto';
import { ProgramSettingsException } from '@modules/program-settings/infrastructure/exceptions/program-settings.exception';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { ObligatoryUpdatedEvent } from '@modules/event/infrastructure/events/obligatory-updated.event';
import { EducationElementArchivedEvent } from '@modules/event/infrastructure/events/education-element-archived.event';
import { flatten } from 'lodash';
import { forEachAsync } from '@core/libs/for-each-async';

@Injectable()
export class UpdateProgramSettingsService {
  constructor(
    @InjectRepository(ProgramSettingRepository)
    private programSettingsRepository: ProgramSettingRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async updateObligatory({ programSettingsId, educationElementIds }: UpdateProgramSettingsDto) {
    const [programSettings, educationElements] = await Promise.all([
      this.programSettingsRepository.findById(programSettingsId),
      this.educationElementRepository.findByIds(educationElementIds),
    ]);
    if (!programSettings) ProgramSettingsException.NotFound();
    const obligatoryIds = programSettings.obligatory?.map(o => o.id) || [];
    const addedEducationElements = educationElements.filter(el => !obligatoryIds.includes(el.id));
    programSettings.setObligatory(educationElements);
    this.eventEmitter.emit(
      EventActionEnum.OBLIGATORY_UPDATED,
      new ObligatoryUpdatedEvent(programSettings.role.id, addedEducationElements, true),
    );
    return await this.programSettingsRepository.save(programSettings);
  }

  async updateOptional({ programSettingsId, educationElementIds }: UpdateProgramSettingsDto) {
    const [programSettings, educationElements] = await Promise.all([
      this.programSettingsRepository.findById(programSettingsId),
      this.educationElementRepository.findByIds(educationElementIds),
    ]);
    if (!programSettings) ProgramSettingsException.NotFound();
    const optionalIds = programSettings.optional?.map(o => o.id) || [];
    const addedEducationElements = educationElements.filter(el => !optionalIds.includes(el.id));
    programSettings.setOptional(educationElements);
    this.eventEmitter.emit(
      EventActionEnum.OBLIGATORY_UPDATED,
      new ObligatoryUpdatedEvent(programSettings.role.id, addedEducationElements, false),
    );
    return await this.programSettingsRepository.save(programSettings);
  }

  @OnEvent(EventActionEnum.EDUCATION_ELEMENT_ARCHIVED, { async: true })
  async handleEducationElementArchived({ educationElementId }: EducationElementArchivedEvent) {
    let programSettings = await this.programSettingsRepository.find({ relations: ['obligatory', 'optional'] })
    programSettings = programSettings.filter(settings => {
      return settings.obligatory.map(obligatory => obligatory.id).includes(educationElementId) ||
        settings.optional.map(optional => optional.id).includes(educationElementId)
    })
    await forEachAsync(programSettings, async (settings) => {
      const obligatoryIds = settings.obligatory
        .map(obligatory => obligatory.id)
        .filter(id => id !== educationElementId)
      const optionalIds = settings.optional
        .map(obligatory => obligatory.id)
        .filter(id => id !== educationElementId)
      if (obligatoryIds.length !== settings.obligatory.length) {
        await this.updateObligatory({ programSettingsId: settings.id, educationElementIds: obligatoryIds })
      }
      if (optionalIds.length !== settings.optional.length) {
        await this.updateOptional({ programSettingsId: settings.id, educationElementIds: optionalIds })
      }
    })
  }
}

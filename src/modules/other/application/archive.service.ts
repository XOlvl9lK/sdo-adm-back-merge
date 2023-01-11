import { Injectable } from '@nestjs/common';
import { BaseEntity } from '@core/domain/base.entity';
import { ArchiveDto } from '@modules/other/controllers/dtos/archive.dto';
import { getManager } from 'typeorm';
import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EducationElementArchivedEvent } from '@modules/event/infrastructure/events/education-element-archived.event';

@Injectable()
export class ArchiveService {
  constructor(
    private eventEmitter: EventEmitter2
  ) {}

  async archive(entity: typeof BaseEntity, { ids }: ArchiveDto) {
    const entityManager = getManager();
    const entityToArchive: BaseEntity[] = await entityManager.findByIds(entity, ids);
    entityToArchive.forEach(entity => entity.archive());
    await entityManager.save(entityToArchive);
    entityToArchive.forEach(element => {
      if (element instanceof EducationElementEntity) {
        this.eventEmitter.emit(EventActionEnum.EDUCATION_ELEMENT_ARCHIVED, new EducationElementArchivedEvent(element.id))
      }
    })
    return entityToArchive
  }

  async unzip(entity: typeof BaseEntity, { ids }: ArchiveDto) {
    const entityManager = getManager();
    const entityToUnzip: BaseEntity[] = await entityManager.findByIds(entity, ids);
    entityToUnzip.forEach(entity => entity.unzip());
    return await entityManager.save(entityToUnzip);
  }
}

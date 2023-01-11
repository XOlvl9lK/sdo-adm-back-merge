import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { CreateEducationProgramDto } from '@modules/education-program/controllers/dtos/create-education-program.dto';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';

@Injectable()
export class CreateEducationProgramService {
  constructor(
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private createProgramElementService: CreateProgramElementService,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  async create(
    {
      title,
      description,
      educationElementIds,
      selfAssignment,
      available,
      chapterId,
      chapterCreateTitle,
      sectionMode,
    }: CreateEducationProgramDto,
    userId: string,
  ) {
    const programElements = await Promise.all(
      educationElementIds.map((educationElementId, idx) =>
        this.createProgramElementService.create({ educationElementId, order: idx + 1 }),
      ),
    );
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    const educationProgram = new EducationProgramEntity(title, description, available, selfAssignment, chapter);
    educationProgram.addProgramElements(programElements);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('программу обучения', userId, educationProgram.id, 'Программы обучения'),
    );
    return await this.educationProgramRepository.save(educationProgram);
  }
}

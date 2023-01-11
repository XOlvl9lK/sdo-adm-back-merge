import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { UpdateEducationProgramDto } from '@modules/education-program/controllers/dtos/update-education-program.dto';
import { EducationProgramException } from '@modules/education-program/infrastructure/exceptions/education-program.exception';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';

@Injectable()
export class UpdateEducationProgramService {
  constructor(
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    @InjectRepository(ProgramElementRepository)
    private programElementRepository: ProgramElementRepository,
    private createProgramElementService: CreateProgramElementService,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  async update(
    {
      id,
      description,
      educationElementIds,
      selfAssignment,
      title,
      available,
      chapterId,
      chapterCreateTitle,
      sectionMode,
    }: UpdateEducationProgramDto,
    userId,
  ) {
    const educationProgram = await this.educationProgramRepository.findByIdWithProgramElements(id);
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    const oldProgramElements = educationProgram.programElements.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      pe => educationElementIds.includes(pe.test?.id) || educationElementIds.includes(pe.course?.id),
    );
    const newEducationElementIds = educationElementIds.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      id => !educationProgram.programElements.map(pe => pe.test?.id || pe.course?.id).includes(id),
    );
    const newProgramElements = await Promise.all([
      ...newEducationElementIds.map((educationElementId, idx) =>
        this.createProgramElementService.create({ educationElementId, order: oldProgramElements.length + idx + 1 }),
      ),
    ]);
    if (!chapter) ChapterException.NotFound();
    if (!educationProgram) EducationProgramException.NotFound();
    educationProgram.update(title, description, chapter, selfAssignment, available, [
      ...oldProgramElements,
      ...newProgramElements,
    ]);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('программу обучения', userId, 'Программы обучения', educationProgram),
    );
    return await this.educationProgramRepository.save(educationProgram);
  }
}

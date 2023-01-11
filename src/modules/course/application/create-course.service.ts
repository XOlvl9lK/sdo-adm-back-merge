import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { ChapterModeEnum, CreateCourseDto } from '@modules/course/controllers/dtos/create-course.dto';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { Injectable } from '@nestjs/common';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { ScormCourseService } from '@modules/course/infrastructure/scorm-course.service';

@Injectable()
export class CreateCourseService {
  constructor(
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
    private scormCourseService: ScormCourseService,
  ) {}

  async create(
    {
      title,
      description,
      chapterId,
      duration,
      selfAssignment,
      available,
      chapterCreateTitle,
      sectionMode,
    }: CreateCourseDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    if (!chapter) ChapterException.NotFound();
    const course = new CourseEntity(title, selfAssignment, available, chapter, duration, description);
    await this.scormCourseService.createScorm(course.id, file.buffer);
    await this.courseRepository.save(course);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('курс', userId, course.id, 'Курсы дистанционного обучения'),
    );
    return;
  }
}

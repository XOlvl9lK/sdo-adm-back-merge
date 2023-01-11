import { Injectable } from '@nestjs/common';
import { UpdateCourseDto } from 'src/modules/course/controllers/dtos/update-course.dto';
import { CourseRepository } from 'src/modules/course/infrastructure/database/course.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseException } from 'src/modules/course/infrastructure/exceptions/course.exception';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@src/modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';

@Injectable()
export class UpdateCourseService {
  constructor(
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  public async update(
    {
      id,
      description,
      chapterId,
      duration,
      title,
      selfAssignment,
      available,
      chapterCreateTitle,
      sectionMode,
    }: UpdateCourseDto,
    userId: string,
  ) {
    const course = await this.courseRepository.findById(id);
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    if (!course) CourseException.NotFound();
    if (!chapter) ChapterException.NotFound();
    course.update(title, duration, selfAssignment, available, chapter, description);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('курс', userId, 'Курсы дистанционного обучения', course),
    );
    return await this.courseRepository.save(course);
  }
}

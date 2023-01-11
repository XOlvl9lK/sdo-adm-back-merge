import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { UpdateTestDto } from 'src/modules/test/controllers/dtos/update-test.dto';
import { TestException } from 'src/modules/test/infrastructure/exceptions/test.exception';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';

@Injectable()
export class UpdateTestService {
  constructor(
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  public async update(
    {
      id,
      chapterId,
      description,
      duration,
      selfAssignment,
      title,
      available,
      chapterCreateTitle,
      sectionMode,
    }: UpdateTestDto,
    userId: string,
  ) {
    const test = await this.testRepository.findById(id);
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    if (!test) TestException.NotFound();
    if (!chapter) ChapterException.NotFound();
    test.update(title, duration, selfAssignment, available, chapter, description);
    this.eventEmitter.emit(EventActionEnum.UPDATE_ENTITY, new UpdateEntityEvent('тест', userId, 'Тесты', test));
    return await this.testRepository.save(test);
  }

  @OnEvent('test/addTheme', { async: true })
  async handleAddThemeEvent(payload: { testId: string }) {
    const test = await this.testRepository.findById(payload.testId);
    test.totalThemes++;
    await this.testRepository.save(test);
  }
}

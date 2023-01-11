import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEntity } from '@modules/test/domain/test.entity';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { CreateTestDto } from '@modules/test/controllers/dtos/create-test.dto';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';
import { ChapterModeEnum } from '@modules/course/controllers/dtos/create-course.dto';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { CreateChapterService } from '@modules/chapter/application/create-chapter.service';

@Injectable()
export class CreateTestService {
  constructor(
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
    private createChapterService: CreateChapterService,
  ) {}

  async create(
    { duration, title, threshold, description, chapterId, chapterCreateTitle, sectionMode }: CreateTestDto,
    userId,
  ) {
    let chapter: ChapterEntity;
    if (sectionMode === ChapterModeEnum.CREATE && chapterCreateTitle) {
      chapter = await this.createChapterService.create({ title: chapterCreateTitle }, userId);
    } else {
      chapter = await this.chapterRepository.findById(chapterId);
    }
    if (!chapter) ChapterException.NotFound();
    const test = new TestEntity(title, duration, chapter, description, threshold);
    this.eventEmitter.emit(EventActionEnum.CREATE_ENTITY, new CreateEntityEvent('тест', userId, test.id, 'Тесты'));
    return await this.testRepository.save(test);
  }
}

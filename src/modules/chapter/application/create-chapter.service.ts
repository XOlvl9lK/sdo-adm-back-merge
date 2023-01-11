import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { CreateChapterDto } from '@modules/chapter/controllers/dtos/create-chapter.dto';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { CreateEntityEvent } from '@modules/event/infrastructure/events/create-entity.event';

@Injectable()
export class CreateChapterService {
  constructor(
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ title, description }: CreateChapterDto, userId: string) {
    if (await this.chapterRepository.isAlreadyExists(title))
      ChapterException.AlreadyExists(`Пользователь id=${userId}. Попытка создания неуникального раздела ${title}`);
    const chapter = new ChapterEntity(title, description);
    this.eventEmitter.emit(
      EventActionEnum.CREATE_ENTITY,
      new CreateEntityEvent('раздел', userId, chapter.id, 'Разделы элементов обучения'),
    );
    return await this.chapterRepository.save(chapter);
  }
}

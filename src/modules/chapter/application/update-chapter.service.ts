import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { UpdateChapterDto } from '@modules/chapter/controllers/dtos/update-chapter.dto';
import { ChapterException } from '@modules/chapter/infrastructure/exceptions/chapter.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

@Injectable()
export class UpdateChapterService {
  constructor(
    @InjectRepository(ChapterRepository)
    private chapterRepository: ChapterRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async update({ id, title, description }: UpdateChapterDto, userId: string) {
    if (await this.chapterRepository.isAlreadyExists(title))
      ChapterException.AlreadyExists(`Пользователь id=${userId}. Попытка создания неуникального раздела ${title}`);
    const chapter = await this.chapterRepository.findById(id);
    if (!chapter) ChapterException.NotFound();
    chapter.update(title, description);
    this.eventEmitter.emit(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent('раздел обучения', userId, 'Разделы обучения', chapter),
    );
    return await this.chapterRepository.save(chapter);
  }
}

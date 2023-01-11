import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { MessageException } from '@modules/messenger/infrastructure/exceptions/message.exception';

@Injectable()
export class DeleteMessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async delete(ids: string[]) {
    const messagesToDelete = await this.messageRepository.findByIds(ids);
    if (!messagesToDelete.length) MessageException.NotFound();
    return await this.messageRepository.remove(messagesToDelete);
  }
}

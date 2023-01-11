import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumRepository } from '@modules/forum/infrastructure/database/forum.repository';

@Injectable()
export class DeleteForumService {
  constructor(
    @InjectRepository(ForumRepository)
    private forumRepository: ForumRepository,
  ) {}

  async delete(id: string) {
    const forumForDelete = await this.forumRepository.findById(id);
    forumForDelete.isDeleted = true;
    return await this.forumRepository.save(forumForDelete);
  }
}

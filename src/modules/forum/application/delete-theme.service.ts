import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThemeRepository } from '@modules/forum/infrastructure/database/forum.repository';

@Injectable()
export class DeleteThemeService {
  constructor(
    @InjectRepository(ThemeRepository)
    private themeRepository: ThemeRepository,
  ) {}

  async delete(id: string) {
    const themeForDelete = await this.themeRepository.findById(id);
    return await this.themeRepository.remove(themeForDelete);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';

@Injectable()
export class FindLastService {
  constructor(
    @InjectRepository(NewsRepository)
    private newsRepository: NewsRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(LibraryFileRepository)
    private libraryFileRepository: LibraryFileRepository,
  ) {}

  async getLast() {
    const [lastNews, lastEducationElements, lastLibraryFiles] = await Promise.all([
      this.newsRepository.findLast(),
      this.educationElementRepository.findLast(),
      this.libraryFileRepository.findLast(),
    ]);
    return {
      lastNews,
      lastEducationElements,
      lastLibraryFiles,
    };
  }
}

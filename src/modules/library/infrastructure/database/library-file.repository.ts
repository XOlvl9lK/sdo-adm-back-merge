import { EntityRepository, ILike, MoreThan } from 'typeorm';
import { InstallersEnum, LibraryFileEntity } from '@modules/library/domain/library-file.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

const unusualSortKeys = ['file.mimetype', 'chapter.title', 'file.size', 'author.fullName', 'file.downloads'];

@EntityRepository(LibraryFileEntity)
export class LibraryFileRepository extends BaseRepository<LibraryFileEntity> {
  findAll({ search, page, pageSize, sort }: RequestQuery) {
    if (sort) {
      const parsedSort = JSON.parse(sort);
      const sortKey = Object.keys(parsedSort)[0];
      const sortValue = parsedSort[sortKey];
      if (unusualSortKeys.includes(sortKey)) {
        return this.createQueryBuilder('library')
          .leftJoinAndSelect('library.author', 'author')
          .leftJoinAndSelect('library.chapter', 'chapter')
          .leftJoinAndSelect('library.file', 'file')
          .take(Number(pageSize))
          .skip((Number(page) - 1) * Number(pageSize))
          .orderBy(sortKey, sortValue)
          .getManyAndCount();
      }
    }
    return this.findAndCount({
      relations: ['author', 'chapter'],
      where: {
        ...this.processSearchQuery(search),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findById(id: string) {
    return this.findOne({ relations: ['chapter'], where: { id } });
  }

  findLast() {
    return this.find({
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  findByVersionAndType(version: string, type: InstallersEnum) {
    return this.findOne({
      where: {
        version,
        type,
      },
    });
  }

  findInstallersByType(type: InstallersEnum) {
    return this.findOne({
      where: {
        type,
      },
      order: { version: 'DESC' },
    });
  }

  findGreaterThenVersion(version: string) {
    return this.findOne({
      where: [
        { type: InstallersEnum.LIN, version: MoreThan(version) },
        { type: InstallersEnum.WIN_86, version: MoreThan(version) },
        { type: InstallersEnum.WIN_64, version: MoreThan(version) },
      ],
      order: { version: 'DESC' },
    });
  }

  findMetadataGreaterThenDate(date: Date) {
    return this.findOne({
      where: [
        { type: InstallersEnum.META_LIN, metadataDate: MoreThan(date) },
        { type: InstallersEnum.META_WIN, metadataDate: MoreThan(date) },
      ],
      order: { metadataDate: 'DESC' },
    });
  }

  findByTypeAndMetadataDate(type: InstallersEnum, metadataDate: string) {
    return this.findOne({
      where: {
        type,
        metadataDateString: ILike(metadataDate),
      },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

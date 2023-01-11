import { BaseRepository } from '@core/database/base.repository';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { EntityRepository, ILike } from 'typeorm';
import {
  EducationElementEntity,
  EducationElementTypeEnum,
} from '@modules/education-program/domain/education-element.entity';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(EducationProgramEntity)
export class EducationProgramRepository extends BaseRepository<EducationProgramEntity> {
  findAll({ search, view, sort, page, pageSize }: RequestQuery) {
    return this.findAndCount({
      relations: ['chapter'],
      where: {
        ...this.processViewQuery(view),
        ...(search ? { title: ILike(`%${search}%`) } : {}),
      },
      ...this.processSortQuery(sort),
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findByIdWithProgramElements(id: string) {
    return this.findOne({
      relations: ['programElements', 'programElements.test', 'programElements.course', 'chapter'],
      where: { id },
    });
  }

  findByIdWithProgramElementsAndSettings(id: string) {
    return this.findOne({
      relations: [
        'programElements',
        'programElements.test',
        'programElements.course',
        'programElements.courseSettings',
        'programElements.testSettings',
        'chapter',
      ],
      where: { id },
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['chapter'],
      where: { id },
    });
  }

  async isAlreadyExists(title: string) {
    return !!(await this.findOne({ where: { title } }));
  }
}

@EntityRepository(EducationElementEntity)
export class EducationElementRepository extends BaseRepository<EducationElementEntity> {
  findLast() {
    return this.find({
      select: ['id', 'createdAt', 'title', 'elementType'],
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  findAll({ search, page, pageSize, view, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('educationElement')
      .leftJoinAndSelect('educationElement.chapter', 'chapter')
      .where(this.processViewQueryRaw('educationElement', view))
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findAllProgramElements({ search, page, pageSize, view }: RequestQuery) {
    return this.findAndCount({
      where: [
        {
          elementType: EducationElementTypeEnum.COURSE,
          ...this.processSearchQuery(search),
          ...this.processViewQuery(view),
        },
        {
          elementType: EducationElementTypeEnum.TEST,
          ...this.processSearchQuery(search),
          ...this.processViewQuery(view),
        },
      ],
      order: { title: 'ASC' },
      ...this.processPaginationQuery(page, pageSize),
    });
  }

  findAllExcludeIds(ids: string[], { pageSize, page, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('educationElement')
      .where('educationElement.isArchived = false')
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .andWhere('educationElement.id NOT IN (:...ids)', { ids: ids.length ? ids : ['1'] })
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }
}

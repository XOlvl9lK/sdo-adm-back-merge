import { BaseRepository } from '@core/database/base.repository';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  PerformanceEntity,
  PerformanceStatusEnum,
  TestPerformanceEntity,
} from '@modules/performance/domain/performance.entity';
import { EntityRepository, ILike, In, IsNull } from 'typeorm';
import { RequestQuery } from '@core/libs/types';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';

@EntityRepository(PerformanceEntity)
export class PerformanceRepository extends BaseRepository<PerformanceEntity> {
  findById(id: string) {
    return this.findOne({
      relations: ['user', 'educationElement', 'assignment'],
      where: {
        id,
      },
    });
  }

  findByIds(ids: string[]) {
    return super.findByIds(ids, {
      relations: [
        'user',
        'educationElement',
        'user.department',
        'user.subdivision',
        'user.groups',
        'user.groups.group',
      ],
    });
  }

  findByIdsSorted(ids: string[], { sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('performance.lastAttempt', 'lastAttempt')
      .leftJoinAndSelect('assignment.group', 'group')
      .where(`performance.id IN (:...ids)`, { ids })
      .orderBy(sortKey, sortValue)
      .getMany();
  }

  findUserTimeTable(userId: string, { search, sort, page, pageSize }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.testSettings', 'testSettings')
      .leftJoinAndSelect('performance.courseSettings', 'courseSettings')
      .leftJoinAndSelect('performance.programSettings', 'programSettings')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .where('user.id = :userId', { userId })
      .andWhere('performance.performance_id is NULL')
      .andWhere(`educationElement.title ilike '%${search || ''}%'`)
      .andWhere(
        `((performance.testSettingsId IS NOT NULL AND (testSettings.numberOfAttempts = 0 OR testSettings.numberOfAttempts - performance.attemptsSpent > 0))
        OR (performance.courseSettingsId IS NOT NULL AND (courseSettings.number_of_attempts = 0 OR courseSettings.number_of_attempts - performance.attemptsSpent > 0))
        OR performance.programSettingsId IS NOT NULL)
      `,
      )
      .andWhere(`(assignment.startDate IS NULL OR (assignment.startDate IS NOT NULL AND assignment.startDate < now()))`)
      .andWhere(`(assignment.endDate IS NULL OR (assignment.endDate IS NOT NULL AND assignment.endDate > now()))`)
      .andWhere(
        `((performance.assignmentId IS NOT NULL AND assignment.isArchived = false) OR performance.assignmentId IS NULL)`,
      )
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByUserId(userId: string, { search, sort, page, pageSize }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.testSettings', 'testSettings')
      .leftJoinAndSelect('performance.courseSettings', 'courseSettings')
      .leftJoinAndSelect('performance.programSettings', 'programSettings')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .where('user.id = :userId', { userId })
      .andWhere('performance.performance_id is NULL')
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .andWhere('performance.lastOpened IS NOT NULL')
      .take(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByPerformanceId(performanceId: string, { page, pageSize, search, sort }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.test', 'test')
      .leftJoinAndSelect('performance.course', 'course')
      .leftJoinAndSelect('performance.testSettings', 'testSettings')
      .leftJoinAndSelect('performance.courseSettings', 'courseSettings')
      .leftJoinAndSelect('performance.programSettings', 'programSettings')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.programElement', 'programElement')
      .where('performance.performance_id = :performanceId', { performanceId })
      .andWhere('programElement.isArchived = false')
      .andWhere(`educationElement.title ILIKE '%${search || ''}%'`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey || 'programElement.order', sortValue || 'ASC')
      .getManyAndCount();
  }

  findUserPeriodPerformance(
    userId: string,
    dateStart: string,
    dateEnd: string,
    { page, pageSize, sort, offset }: RequestQuery,
  ) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .where('user.id = :userId', { userId })
      .andWhere(`performance.startDate BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)
      .andWhere('performance.elementType = :elementType', {
        elementType: EducationElementTypeEnum.PROGRAM,
      })
      .andWhere('assignment.isObligatory = true')
      .take(pageSize ? Number(pageSize) : undefined)
      .skip(skip)
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findUserPerformance(userId: string, { page, pageSize, sort, offset }: RequestQuery) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('assignment.group', 'group')
      .where('user.id = :userId', { userId })
      .andWhere('performance.elementType = :elementType', {
        elementType: EducationElementTypeEnum.PROGRAM,
      })
      .andWhere('assignment.isObligatory = true')
      .take(pageSize ? Number(pageSize) : undefined)
      .skip(skip)
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findUserProgramPerformance(
    programId: string,
    dateStart: string,
    dateEnd: string,
    { page, pageSize, sort, offset }: RequestQuery,
  ) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('assignment.group', 'group')
      .where('educationElement.id = :programId', { programId })
      .andWhere(`performance.startDate BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)
      .andWhere('assignment.isObligatory = true')
      .take(pageSize ? Number(pageSize) : undefined)
      .skip(skip)
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findGroupProgramPerformance(
    programId: string,
    groupId: string,
    dateStart: string,
    dateEnd: string,
    { page, pageSize, sort, offset }: RequestQuery,
  ) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('user.department', 'department')
      .where('educationElement.id = :programId', { programId })
      .andWhere('assignment.ownerType = :ownerType', { ownerType: EducationRequestOwnerTypeEnum.GROUP })
      .andWhere(`performance.startDate BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)
      .andWhere('assignment.isObligatory = true')
      .andWhere('assignment.groupId = :groupId', { groupId }) // Костыль
      .take(pageSize ? Number(pageSize) : undefined)
      .skip(skip)
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findForReportUser(
    dateStart: string,
    dateEnd: string,
    type: EducationElementTypeEnum.COURSE | EducationElementTypeEnum.PROGRAM,
    { sort, page, pageSize, offset }: RequestQuery,
    userIds: string[],
    courseIds?: string[],
    programIds?: string[],
    subdivisionId?: string,
    departmentId?: string,
    groupIds?: string[]
  ) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    const qb = this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('assignment.group', 'group')
      .where(`user.createdAt BETWEEN '${this.getLowerDateLimit(dateStart)}' AND '${this.getUpperDateLimit(dateEnd)}'`)
      .andWhere(`educationElement.elementType = :type`, { type })
      .andWhere('assignment.isObligatory = true')
      .skip(skip)
      .take(Number(pageSize))
      .orderBy(sortKey, sortValue);

    this.addWhere(
      Boolean(subdivisionId),
      qb,
      `subdivision.id = '${subdivisionId}'`
    )
    this.addWhere(
      Boolean(departmentId),
      qb,
      `department.id = '${departmentId}'`
    )
    this.addWhere(
      Boolean(userIds?.length),
      qb,
      `user.id IN (:...userIds)`,
      { userIds }
    )
    this.addWhere(
      Boolean(groupIds?.length),
      qb,
      `group.id IN (:...groupIds)`,
      { groupIds }
    )
    this.addWhere(
      Boolean(courseIds?.length || programIds?.length),
      qb,
      `(educationElement.id IN (:...elementIds) AND performance_id IS NULL)`,
      {
        elementIds: courseIds?.length ? courseIds : programIds,
      },
    );

    return qb.getManyAndCount();
  }

  findForOpenSessionsReport({ sort, page, pageSize, offset }: RequestQuery) {
    const skip = this.processSkipQueryRaw(page, pageSize, offset)
    const { sortKey, sortValue } = this.processSortQueryRaw(sort);
    return this.createQueryBuilder('performance')
      .leftJoinAndSelect('performance.user', 'user')
      .leftJoinAndSelect('performance.educationElement', 'educationElement')
      .leftJoinAndSelect('performance.assignment', 'assignment')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.subdivision', 'subdivision')
      .leftJoinAndSelect('performance.lastAttempt', 'lastAttempt')
      .leftJoinAndSelect('assignment.group', 'group')
      .andWhere('performance.elementType = :elementType', {
        elementType: EducationElementTypeEnum.PROGRAM,
      })
      .andWhere('assignment.isObligatory = true')
      .take(pageSize ? Number(pageSize) : undefined)
      .skip(skip)
      .orderBy(sortKey, sortValue)
      .getManyAndCount();
  }

  findByUserIds(userIds: string[]) {
    return this.find({
      relations: ['user', 'assignment'],
      where: {
        user: { id: In(userIds) },
        performance_id: IsNull(),
        assignment: {
          isObligatory: true,
        },
      },
    });
  }

  findByAssignmentIdsAndUserIds(assignmentIds: string[], userIds: string[]) {
    return this.find({
      where: {
        assignmentId: In(assignmentIds),
        userId: In(userIds)
      }
    })
  }

  findByParentPerformanceIds(parentPerformanceIds: string[]) {
    return this.find({
      where: {
        performance_id: In(parentPerformanceIds)
      }
    })
  }
}

@EntityRepository(TestPerformanceEntity)
export class TestPerformanceRepository extends BaseRepository<TestPerformanceEntity> {

  findByUserId(userId: string, search?: string) {
    return this.find({
      relations: ['user', 'test', 'lastAttempt'],
      where: {
        user: { id: userId },
        ...(search ? { test: { title: ILike(`%${search}%`) } } : {}),
      },
    });
  }

  findById(id: string) {
    return this.findOne({ relations: ['test'], where: { id } });
  }

  findByIdWithSettings(id: string) {
    return this.findOne({
      relations: ['test', 'testSettings', 'lastAttempt'],
      where: { id },
    });
  }

  findByIdWithAllRelations(id: string) {
    return this.findOne({
      relations: [
        'user',
        'test',
        'lastAttempt',
        'lastAttempt.questionAttempts',
        'lastAttempt.questionAttempts.answerAttempts',
        'testSettings',
        'assignment',
        'performance'
      ],
      where: { id },
    });
  }

  findByIdWithLastAttempt(id: string) {
    return this.findOne({
      relations: [
        'lastAttempt',
        'lastAttempt.questionAttempts',
        'lastAttempt.questionAttempts.question',
        'lastAttempt.questionAttempts.question.answers',
        'lastAttempt.questionAttempts.answerAttempts',
        'testSettings',
        'test',
      ],
      where: { id },
    });
  }
}

@EntityRepository(CoursePerformanceEntity)
export class CoursePerformanceRepository extends BaseRepository<CoursePerformanceEntity> {
  findByUserId(userId: string, search?: string) {
    return this.find({
      relations: ['user', 'course'],
      where: {
        user: { id: userId },
        ...(search ? { course: { title: ILike(`%${search}%`) } } : {}),
      },
    });
  }

  findById(id: string) {
    return this.findOne({
      relations: ['course'],
      where: {
        id,
      },
    });
  }

  findByIdWithAttempt(id: string) {
    return this.findOne({
      relations: ['course', 'lastAttempt', 'courseSettings', 'performance'],
      where: {
        id,
      },
    });
  }
}

@EntityRepository(EducationProgramPerformanceEntity)
export class EducationProgramPerformanceRepository extends BaseRepository<EducationProgramPerformanceEntity> {
  findById(id: string) {
    return this.findOne({
      relations: ['educationProgram', 'programSettings', 'educationProgram.programElements'],
      where: {
        id,
      },
    });
  }

  findCompletedByUserIds(userIds: string[]) {
    return this.find({
      relations: ['user'],
      where: {
        status: PerformanceStatusEnum.COMPLETED,
        user: {
          id: In(userIds),
        },
      },
    });
  }
}

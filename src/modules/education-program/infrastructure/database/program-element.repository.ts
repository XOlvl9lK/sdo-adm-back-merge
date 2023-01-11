import { EntityRepository } from 'typeorm';
import { ProgramElementEntity, ProgramElementTypeEnum } from '@modules/education-program/domain/program-element.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(ProgramElementEntity)
export class ProgramElementRepository extends BaseRepository<ProgramElementEntity> {
  findByProgramId(educationProgramId: string, { search }: RequestQuery) {
    return this.createQueryBuilder('programElement')
      .leftJoinAndSelect('programElement.educationProgram', 'educationProgram')
      .leftJoinAndSelect('programElement.course', 'course')
      .leftJoinAndSelect('programElement.test', 'test')
      .where('educationProgram.id = :educationProgramId', {
        educationProgramId,
      })
      .andWhere(`(course.title ILIKE '%${search || ''}%' OR test.title ILIKE '%${search || ''}%')`)
      .orderBy('programElement.order', 'ASC')
      .getManyAndCount();
  }

  findCourseElementById(id: string) {
    return this.findOne({
      relations: ['course', 'courseSettings', 'educationProgram'],
      where: {
        id,
        elementType: ProgramElementTypeEnum.COURSE,
      },
    });
  }

  findTestElementById(id: string) {
    return this.createQueryBuilder('testElement')
      .leftJoinAndSelect('testElement.test', 'test')
      .leftJoinAndSelect('testElement.testSettings', 'testSettings')
      .leftJoinAndSelect('testElement.educationProgram', 'educationProgram')
      .where('testElement.id = :id', { id })
      .andWhere('testElement.elementType = :elementType', {
        elementType: ProgramElementTypeEnum.TEST,
      })
      .getOne();
  }

  findTestElementByIdForTestAttempt(id: string) {
    return this.createQueryBuilder('testElement')
      .leftJoinAndSelect('testElement.test', 'test')
      .leftJoinAndSelect('testElement.testSettings', 'testSettings')
      .leftJoinAndSelect('testElement.educationProgram', 'educationProgram')
      .leftJoinAndSelect('test.themes', 'themes')
      .leftJoinAndSelect('themes.theme', 'theme')
      .leftJoinAndSelect('theme.questions', 'questions')
      .leftJoinAndSelect('questions.question', 'question')
      .leftJoinAndSelect('question.answers', 'answers')
      .where('testElement.id = :id', { id })
      .andWhere('testElement.elementType = :elementType', {
        elementType: ProgramElementTypeEnum.TEST,
      })
      .andWhere('theme.isArchived = false')
      .getOne();
  }
}

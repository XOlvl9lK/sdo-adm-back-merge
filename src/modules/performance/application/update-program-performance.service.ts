import { Injectable } from '@nestjs/common';
import { PerformanceStatusEnum } from '@modules/performance/domain/performance.entity';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EducationProgramPerformanceRepository, PerformanceRepository
} from '@modules/performance/infrastructure/database/performance.repository';

@Injectable()
export class UpdateProgramPerformanceService {
  constructor(
    @InjectRepository(EducationProgramPerformanceRepository)
    private educationProgramPerformanceRepository: EducationProgramPerformanceRepository,
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository
  ) {}

  async update(programPerformanceId: string) {
    const [performance, [performancesByProgram]] = await Promise.all([
      this.educationProgramPerformanceRepository.findById(programPerformanceId),
      this.performanceRepository.findByPerformanceId(programPerformanceId, {}),
    ]);
    if (performance.status === PerformanceStatusEnum.DID_NOT_OPEN) {
      performance.startDate = new Date();
      performance.changeStatus(PerformanceStatusEnum.IN_PROGRESS);
    }
    const obligatory = performancesByProgram.filter(p => {
      return !!(p.testSettings?.isObligatory || p.courseSettings?.isObligatory);
    });

    const obligatoryAndPassed = obligatory.filter(p => {
      return p.status === PerformanceStatusEnum.PASSED || p.status === PerformanceStatusEnum.COMPLETED;
    });

    const obligatoryAndFailed = obligatory.filter(p => {
      return p.status === PerformanceStatusEnum.FAILED || p.status === PerformanceStatusEnum.NOT_FINISHED
    })

    let isSomeoneObligatoryFailed = false

    obligatoryAndFailed.forEach(p => {
      if (p.elementType === EducationElementTypeEnum.TEST) {
        if (p?.testSettings?.numberOfAttempts - p.attemptsSpent <= 0) isSomeoneObligatoryFailed = true
      } else if (p.elementType === EducationElementTypeEnum.COURSE) {
        if (p?.courseSettings?.numberOfAttempts - p.attemptsSpent <= 0) isSomeoneObligatoryFailed = true
      }
    })

    if (isSomeoneObligatoryFailed) {
      performance.changeStatus(PerformanceStatusEnum.NOT_FINISHED)
    }

    if (obligatory.length) {
      performance.result = Math.round((obligatoryAndPassed.length / obligatory.length) * 100);
    } else {
      performance.result = 100;
    }
    if (performance.result === 100) {
      performance.changeStatus(PerformanceStatusEnum.COMPLETED);
      performance.completeDate = new Date();
    }
    await this.educationProgramPerformanceRepository.save(performance);
  }
}

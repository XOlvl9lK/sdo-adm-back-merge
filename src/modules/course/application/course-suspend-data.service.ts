import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSuspendDataRepository } from '@modules/course/infrastructure/database/course-suspend-data.repository';
import { CreateSuspendDataDto } from '@modules/course/controllers/dtos/create-suspend-data.dto';
import { CourseSuspendDataEntity } from '@modules/course/domain/course-suspend-data.entity';

@Injectable()
export class CourseSuspendDataService {
  constructor(
    @InjectRepository(CourseSuspendDataRepository)
    private courseSuspendDataRepository: CourseSuspendDataRepository,
  ) {}

  async findByUserIdAndAttemptId(attemptId: string) {
    return await this.courseSuspendDataRepository.findByAttemptId(attemptId);
  }

  async createOrUpdatedSuspendData({
    suspendData,
    userId,
    lessonStatus,
    lessonLocation,
    attemptId,
  }: CreateSuspendDataDto) {
    let data = await this.courseSuspendDataRepository.findByAttemptId(attemptId);
    if (data) {
      data.update(lessonStatus, lessonLocation, suspendData);
    } else {
      data = new CourseSuspendDataEntity(userId, attemptId, lessonStatus, lessonLocation, suspendData);
    }
    return await this.courseSuspendDataRepository.save(data);
  }

  async clearSuspendData(attemptId: string) {
    const data = await this.courseSuspendDataRepository.findByAttemptId(attemptId);
    if (data) {
      await this.courseSuspendDataRepository.remove(data);
    }
  }
}

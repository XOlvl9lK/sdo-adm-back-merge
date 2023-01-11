import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  PerformanceStatusEnum,
  TestPerformanceEntity,
} from '@modules/performance/domain/performance.entity';
import { Random } from '@core/test/random';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import {
  mockCourseAssignmentInstance,
  mockEducationProgramAssignmentInstance,
  mockTestAssignmentInstance,
} from '@modules/education-request/domain/assignment.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockCourseAttemptInstance, mockTestAttemptInstance } from '@modules/performance/domain/attempt.entity.spec';
import { plainToInstance } from 'class-transformer';
import { mockEducationProgramInstance } from '@modules/education-program/domain/education-program.entity.spec';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';

const mockPerformance = {
  ...mockBaseEntity,
  user: mockUserInstance,
  result: 80,
  status: PerformanceStatusEnum.PASSED,
  attemptsSpent: 2,
  lastOpened: Random.datePast,
  startDate: Random.datePast,
  completeDate: Random.datePast,
  testSettings: mockTestSettingsInstance,
  courseSettings: mockCourseSettingsInstance,
  programSettings: mockEducationProgramSettingsInstance,
};

const mockTestPerformance = {
  ...mockPerformance,
  elementType: EducationElementTypeEnum.TEST,
  assignment: mockTestAssignmentInstance,
  educationElement: mockTestInstance,
  test: mockTestInstance,
  lastAttempt: mockTestAttemptInstance,
};

export const mockTestPerformanceInstance = plainToInstance(TestPerformanceEntity, mockTestPerformance, {
  enableCircularCheck: true,
});

const mockEducationProgramPerformance = {
  ...mockPerformance,
  elementType: EducationElementTypeEnum.PROGRAM,
  assignment: mockEducationProgramAssignmentInstance,
  educationElement: mockEducationProgramInstance,
  educationProgram: mockEducationProgramInstance,
};

export const mockEducationProgramPerformanceInstance = plainToInstance(
  EducationProgramPerformanceEntity,
  mockEducationProgramPerformance,
  {
    enableCircularCheck: true,
  },
);

const mockCoursePerformance = {
  ...mockPerformance,
  course: mockCourseInstance,
  assignment: mockCourseAssignmentInstance,
  elementType: EducationElementTypeEnum.COURSE,
  educationElement: mockCourseInstance,
  lastAttempt: mockCourseAttemptInstance,
};

export const mockCoursePerformanceInstance = plainToInstance(CoursePerformanceEntity, mockCoursePerformance);

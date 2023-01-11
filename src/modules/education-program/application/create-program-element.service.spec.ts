import { educationElementRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CreateTestSettingsService } from '@modules/education-program/application/create-test-settings.service';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { CreateCourseSettingsService } from '@modules/education-program/application/create-course-settings.service';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { CreateProgramElementService } from '@modules/education-program/application/create-program-element.service';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import {
  CourseProgramElementEntity,
  TestProgramElementEntity,
} from '@modules/education-program/domain/program-element.entity';
import { mockTestProgramElementInstance } from '@modules/education-program/domain/education-program.entity.spec';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
jest.mock('@modules/education-program/domain/program-element.entity');
//@ts-ignore
TestProgramElementEntity.mockImplementation(() => mockTestProgramElementInstance);
//@ts-ignore
CourseProgramElementEntity.mockImplementation(() => mockTestProgramElementInstance);

const helpers = new TestHelper(
  educationElementRepositoryMockProvider,
  {
    type: 'createService',
    provide: CreateTestSettingsService,
    extend: [{ method: 'create', mockImplementation: jest.fn().mockResolvedValue(mockTestSettingsInstance) }],
  },
  {
    type: 'createService',
    provide: CreateCourseSettingsService,
    extend: [{ method: 'create', mockImplementation: jest.fn().mockResolvedValue(mockCourseSettingsInstance) }],
  },
);

describe('CreateProgramElementService', () => {
  let createProgramElementService: CreateProgramElementService;

  beforeAll(async () => {
    [createProgramElementService] = await helpers.beforeAll([CreateProgramElementService]);
  });

  test('Should return new test program element', async () => {
    const result = await createProgramElementService.createTestProgramElement(mockTestInstance, 1);

    expect(result).toEqual(mockTestProgramElementInstance);
  });

  test('Should return new course program element', async () => {
    const result = await createProgramElementService.createCourseProgramElement(mockCourseInstance, 2);

    expect(result).toEqual(mockTestProgramElementInstance);
  });
});

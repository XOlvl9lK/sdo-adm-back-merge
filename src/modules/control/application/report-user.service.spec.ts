import {
  courseRepositoryMockProvider,
  departmentRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
  groupRepositoryMockProvider,
  performanceRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { ReportUserService } from '@modules/control/application/report-user.service';
import { Random } from '@core/test/random';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { mockTestPerformanceInstance } from '@modules/performance/domain/performance.entity.spec';
import { Buffer } from 'buffer';

const helpers = new TestHelper(
  groupRepositoryMockProvider,
  performanceRepositoryMockProvider,
  userRepositoryMockProvider,
  departmentRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  courseRepositoryMockProvider,
  educationProgramRepositoryMockProvider,
);

describe('ReportUserService', () => {
  let reportUserService: ReportUserService;

  beforeAll(async () => {
    [reportUserService] = await helpers.beforeAll([ReportUserService]);
  });

  test('Should return course report', async () => {
    const result = await reportUserService.getReportCourse({
      dateStart: Random.datePast.toISOString(),
      dateEnd: Random.dateFuture.toISOString(),
      groupIds: [],
      userId: Random.id,
      type: EducationElementTypeEnum.COURSE,
    });

    expect(result).toEqual([[mockTestPerformanceInstance], Random.number]);
  });

  test('Size should be greater than 0', async () => {
    await reportUserService.exportXlsx(
      {
        dateStart: Random.datePast.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
        groupIds: [],
        userId: Random.id,
        type: EducationElementTypeEnum.COURSE,
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await reportUserService.exportXls(
      {
        dateStart: Random.datePast.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
        groupIds: [],
        userId: Random.id,
        type: EducationElementTypeEnum.COURSE,
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await reportUserService.exportOds(
      {
        dateStart: Random.datePast.toISOString(),
        dateEnd: Random.dateFuture.toISOString(),
        groupIds: [],
        userId: Random.id,
        type: EducationElementTypeEnum.COURSE,
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });
});

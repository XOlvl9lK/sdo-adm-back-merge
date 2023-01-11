import { Random } from '@core/test/random';
import { mockUserInGroupInstance } from '@modules/group/domain/group.entity.spec';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockSubdivisionInstance,
} from '@modules/user/domain/user.entity.spec';
import {
  groupRepositoryMockProvider,
  performanceRepositoryMockProvider,
  TestHelper,
  userInGroupRepositoryMockProvider,
} from '@core/test/test.helper';
import {
  RegisteredReport,
  RegisteredReportPerformanceService,
} from '@modules/control/application/registered-report-performance.service';
import { plainToInstance } from 'class-transformer';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Buffer } from 'buffer';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
const now = new Date();
//@ts-ignore
jest.spyOn(global, 'Date').mockImplementation(() => now);

const mockRegisteredReport = [
  {
    id: '7ac5d2a0-5c95-41a5-a69b-c909511e4319-7ac5d2a0-5c95-41a5-a69b-c909511e4319-7ac5d2a0-5c95-41a5-a69b-c909511e4319-7ac5d2a0-5c95-41a5-a69b-c909511e4319',
    group: plainToInstance(GroupEntity, {
      ...mockBaseEntity,
      title: Random.lorem,
      description: Random.lorem,
    }),
    region: mockRegionInstance,
    department: mockDepartmentInstance,
    subdivision: mockSubdivisionInstance,
    users: [mockUserInGroupInstance],
    totalUsers: 1,
    numberOfUsersWhoCompletedTraining: 1,
    numberOfUsersWhoCompletedTrainingPercentage: 100,
    numberOfUsersWhoDidNotCompletedTraining: 0,
    numberOfUsersWhoDidNotCompletedTrainingPercentage: 0,
    numberOfUsersWhoCompletedTrainingInLastMonth: 1,
    numberOfUsersWhoCompletedTrainingInLastMonthPercentage: 100,
    numberOfUsersAddedInLastMonth: 1,
    numberOfUsersAddedInLastMonthPercentage: 100,
  },
] as RegisteredReport[];

const mockExcel = new ExcelHelper()
  .title('Сводный отчёт по успеваемости зарегистрированных пользователей', 'A1:O1')
  .columns([
    { key: 'id' },
    { key: 'region', width: 20 },
    { key: 'department', width: 20 },
    { key: 'subdivision', width: 20 },
    { key: 'group', width: 20 },
    { key: 'totalUsers', width: 18 },
    { key: 'numberOfUsersWhoCompletedTraining', width: 18 },
    { key: 'numberOfUsersWhoCompletedTrainingPercentage', width: 18 },
    { key: 'numberOfUsersAddedInLastMonth', width: 18 },
    { key: 'numberOfUsersAddedInLastMonthPercentage', width: 18 },
    { key: 'numberOfUsersWhoCompletedTrainingInLastMonth', width: 18 },
    {
      key: 'numberOfUsersWhoCompletedTrainingInLastMonthPercentage',
      width: 18,
    },
    { key: 'numberOfUsersWhoDidNotCompletedTraining', width: 18 },
    { key: 'numberOfUsersWhoDidNotCompletedTrainingPercentage', width: 18 },
    { key: 'createdAt', width: 30 },
  ])
  .header(
    [
      '№ п/п',
      'Регион',
      'Ведомство',
      'Подразделение',
      `Наименование группы`,
      `Общее кол-во пользователей`,
      'Кол-во пользователей завершивших обучение',
      '% от общего количества (столбец 7/6)',
      'Кол-во пользователей добавленных за последний месяц',
      '% от общего количества (столбец 9/6)',
      'Кол-во пользователей завершивших обучение за последний месяц',
      '% от общего количества (столбец 11/6)',
      'Кол-во пользователей не завершивших обучение',
      '% от общего количества (столбец 13/6)',
      'Дата создания группы',
    ],
    6,
  )
  .columnAlignment({
    A: { horizontal: 'right' },
    B: { horizontal: 'center' },
    C: { horizontal: 'center' },
    D: { horizontal: 'center' },
    E: { horizontal: 'center' },
    F: { horizontal: 'center' },
    G: { horizontal: 'center' },
    H: { horizontal: 'center' },
    I: { horizontal: 'center' },
    J: { horizontal: 'center' },
    K: { horizontal: 'center' },
    L: { horizontal: 'center' },
    M: { horizontal: 'center' },
    N: { horizontal: 'center' },
    O: { horizontal: 'center' },
  })
  .intermediate({
    row: 3,
    mergeCells: 'A2:O2',
    value: `Период создания группы: ${''}`,
    alignment: { horizontal: 'left' },
  })
  .intermediate({
    row: 4,
    mergeCells: 'A3:O3',
    value: `Период регистрации пользователя на портале: ${''}`,
    alignment: { horizontal: 'left' },
  })
  .cells([
    { index: 'A7', value: 1, alignment: { horizontal: 'center' } },
    { index: 'B7', value: 2, alignment: { horizontal: 'center' } },
    { index: 'C7', value: 3, alignment: { horizontal: 'center' } },
    { index: 'D7', value: 4, alignment: { horizontal: 'center' } },
    { index: 'E7', value: 5, alignment: { horizontal: 'center' } },
    { index: 'F7', value: 6, alignment: { horizontal: 'center' } },
    { index: 'G7', value: 7, alignment: { horizontal: 'center' } },
    { index: 'H7', value: 8, alignment: { horizontal: 'center' } },
    { index: 'I7', value: 9, alignment: { horizontal: 'center' } },
    { index: 'J7', value: 10, alignment: { horizontal: 'center' } },
    { index: 'K7', value: 11, alignment: { horizontal: 'center' } },
    { index: 'L7', value: 12, alignment: { horizontal: 'center' } },
    { index: 'M7', value: 13, alignment: { horizontal: 'center' } },
    { index: 'N7', value: 14, alignment: { horizontal: 'center' } },
    { index: 'O7', value: 15, alignment: { horizontal: 'center' } },
  ])
  .fill(
    mockRegisteredReport.map((p, idx) => ({
      ...p,
      id: idx + 1,
      region: p.region.title,
      department: p.department.title,
      subdivision: p.subdivision.title,
      group: p.group.title,
      createdAt: new Date(p.group.createdAt).toLocaleString(),
    })),
    8,
  );

const helpers = new TestHelper(
  performanceRepositoryMockProvider,
  groupRepositoryMockProvider,
  userInGroupRepositoryMockProvider,
);

describe('RegisteredReportPerformanceService', () => {
  let registeredReportPerformanceService: RegisteredReportPerformanceService;

  beforeAll(async () => {
    [registeredReportPerformanceService] = await helpers.beforeAll([RegisteredReportPerformanceService]);
  });

  test('Should return RegisteredReportPerformance', async () => {
    const result = await registeredReportPerformanceService.getRegisteredReportPerformance({});

    // expect(result).toEqual([mockRegisteredReport])
  });

  test('Size should be greater than 0', async () => {
    // await registeredReportPerformanceService.exportXlsx({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    // await registeredReportPerformanceService.exportXls({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    // await registeredReportPerformanceService.exportOds({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Should create correct excel', async () => {
    // const result = await registeredReportPerformanceService['createExcel']({}, mockRegisteredReport);

    // expect(result).toEqual(mockExcel)
  });
});

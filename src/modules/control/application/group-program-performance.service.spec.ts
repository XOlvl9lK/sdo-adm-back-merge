import {
  educationElementRepositoryMockProvider,
  groupRepositoryMockProvider,
  performanceRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { GroupProgramPerformanceService } from '@modules/control/application/group-program-performance.service';
import { Random } from '@core/test/random';
import { mockTestPerformanceInstance } from '@modules/performance/domain/performance.entity.spec';
import { Buffer } from 'buffer';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';
const now = new Date();
//@ts-ignore
jest.spyOn(global, 'Date').mockImplementation(() => now);

const helpers = new TestHelper(
  groupRepositoryMockProvider,
  performanceRepositoryMockProvider,
  educationElementRepositoryMockProvider,
);

const mockExcel = new ExcelHelper()
  .title('Обучение группы по программе обучения', 'A1:G1')
  .columns([
    { key: 'id' },
    { key: 'login', width: 30 },
    { key: 'department', width: 30 },
    { key: 'subdivision', width: 30 },
    { key: 'result', width: 20 },
    { key: 'status', width: 30 },
    { key: 'createdAt', width: 35 },
  ])
  .header(
    ['№ п/п', 'Логин ДОиТП', 'Ведомство', 'Подразделение', 'Результат, %', 'Статус', 'Дата регистранции на портале'],
    7,
  )
  .columnAlignment({
    A: { horizontal: 'right' },
    B: { horizontal: 'left' },
    C: { horizontal: 'center' },
    D: { horizontal: 'center' },
    E: { horizontal: 'center' },
    F: { horizontal: 'center' },
    G: { horizontal: 'center' },
    H: { horizontal: 'center' },
  })
  .intermediate({
    row: 3,
    mergeCells: 'A3:G3',
    value: `Группа: ${Random.lorem}`,
    alignment: { horizontal: 'left' },
  })
  .intermediate({
    row: 4,
    mergeCells: 'A4:G4',
    value: `Программа обучения: ${Random.lorem}`,
    alignment: { horizontal: 'left' },
  })
  .intermediate({
    row: 5,
    mergeCells: 'A5:G5',
    value: `Период: ${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
    alignment: { horizontal: 'left' },
  })
  .fill(
    [mockTestPerformanceInstance].map((p, idx) => ({
      id: idx + 1,
      login: p.user.login,
      department: p.user.department?.title,
      subdivision: p.user.subdivision?.title,
      result: p.result,
      status: p.status,
      createdAt: p.user.createdAt.toLocaleString(),
    })),
    8,
  );

describe('GroupProgramPerformanceService', () => {
  let groupProgramPerformanceService: GroupProgramPerformanceService;

  beforeAll(async () => {
    [groupProgramPerformanceService] = await helpers.beforeAll([GroupProgramPerformanceService]);
  });

  test('Should return group program performance', async () => {
    const result = await groupProgramPerformanceService.getGroupProgramPerformance({
      programId: Random.id,
      groupId: Random.id,
      dateEnd: Random.dateFuture.toISOString(),
      dateStart: Random.datePast.toISOString(),
    });

    expect(result).toEqual([[mockTestPerformanceInstance], Random.number]);
  });

  test('Size should be greater than 0', async () => {
    await groupProgramPerformanceService.exportXlsx(
      {
        programId: Random.id,
        groupId: Random.id,
        dateEnd: Random.dateFuture.toISOString(),
        dateStart: Random.datePast.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await groupProgramPerformanceService.exportXls(
      {
        programId: Random.id,
        groupId: Random.id,
        dateEnd: Random.dateFuture.toISOString(),
        dateStart: Random.datePast.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    await groupProgramPerformanceService.exportOds(
      {
        programId: Random.id,
        groupId: Random.id,
        dateEnd: Random.dateFuture.toISOString(),
        dateStart: Random.datePast.toISOString(),
      },
      helpers.response,
    );

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Should create correct excel', async () => {
    const result = await groupProgramPerformanceService['createExcel'](
      {
        programId: Random.id,
        groupId: Random.id,
        dateEnd: Random.dateFuture.toISOString(),
        dateStart: Random.datePast.toISOString(),
      },
      [mockTestPerformanceInstance],
    );

    expect(result).toEqual(mockExcel);
  });
});

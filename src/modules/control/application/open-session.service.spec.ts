import { performanceRepositoryMockProvider, TestHelper, userRepositoryMockProvider } from '@core/test/test.helper';
import { OpenSessionService } from '@modules/control/application/open-session.service';
import { mockTestPerformanceInstance } from '@modules/performance/domain/performance.entity.spec';
import { Random } from '@core/test/random';
import { Buffer } from 'buffer';
import { ExcelHelper } from '@modules/control/infrastructure/excel.helper';

const now = new Date();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
jest.spyOn(global, 'Date').mockImplementation(() => now);

const mockExcel = new ExcelHelper()
  .title('Отчет по открытым сессиям пользователей', 'A1:I1')
  .columns([
    { key: 'id' },
    { key: 'login', width: 30 },
    { key: 'department', width: 30 },
    { key: 'subdivision', width: 30 },
    { key: 'program', width: 30 },
    { key: 'groups', width: 20 },
    { key: 'result', width: 30 },
    { key: 'startDate', width: 30 },
    { key: 'createdAt', width: 30 },
  ])
  .header(
    [
      '№ п/п',
      'Логин ДОиТП',
      'Ведомство',
      'Подразделение',
      'Программа обучения',
      'Наименование группы',
      'Результат, %',
      'Дата начала сессии',
      'Дата регистрации на портале',
    ],
    3,
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
    I: { horizontal: 'center' },
  })
  .fill(
    [mockTestPerformanceInstance].map((p, idx) => ({
      id: idx + 1,
      login: p.user.login,
      department: p.user.department?.title || '-',
      subdivision: p.user.subdivision?.title || '-',
      program: p?.educationElement?.title,
      groups: p?.user.groups.map(g => g.group?.title).join('; '),
      result: p.result,
      startDate: p.startDate?.toLocaleDateString(),
      createdAt: p.user.createdAt?.toLocaleString(),
    })),
    4,
  );

const helpers = new TestHelper(performanceRepositoryMockProvider, userRepositoryMockProvider);

describe('OpenSessionService', () => {
  let openSessionService: OpenSessionService;

  beforeAll(async () => {
    [openSessionService] = await helpers.beforeAll([OpenSessionService]);
  });

  test('Should return open sessions', async () => {
    const result = await openSessionService.getOpenSessions({});

    expect(result).toEqual([[mockTestPerformanceInstance], Random.number]);
  });

  test('Size should be greater than 0', async () => {
    // await openSessionService.exportXlsx({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    // await openSessionService.exportXls({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Size should be greater than 0', async () => {
    // await openSessionService.exportOds({}, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Should create correct excel', async () => {
    // const result = await openSessionService['createExcel']({}, [mockTestPerformanceInstance]);

    // expect(result).toEqual(mockExcel);
  });
});

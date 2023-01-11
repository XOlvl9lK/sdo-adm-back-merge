import {
  TestHelper,
  testRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
  userEducationRequestRepositoryMockProvider,
} from '@core/test/test.helper';
import { FindTestService } from '@modules/test/application/find-test.service';
import { Test } from '@nestjs/testing';
import { mockTestInstance, mockThemeInTestInstance } from '@modules/test/domain/test.entity.spec';
import { Random } from '@core/test/random';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';

const helpers = new TestHelper(
  testRepositoryMockProvider,
  userEducationRequestRepositoryMockProvider,
  themeInTestRepositoryMockProvider,
);

describe('FindTestService', () => {
  let findTestService: FindTestService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindTestService, ...helpers.mockProviders],
    }).compile();

    findTestService = moduleRef.get(FindTestService);
  });

  test('Should return all tests and count', async () => {
    const result = await findTestService.findAll({});

    expect(result).toEqual([[mockTestInstance], Random.number]);
  });

  test('Should return test by id with themes and count', async () => {
    const result = await findTestService.findById(Random.id, {}, Random.id);

    expect(result).toEqual({
      total: Random.number,
      data: {
        ...mockTestInstance,
        themes: [mockThemeInTestInstance],
        requestStatuses: [mockUserEducationRequestInstance].map(r => r.status),
      },
    });
  });
});

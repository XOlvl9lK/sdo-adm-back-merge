import {
  educationProgramRepositoryMockProvider,
  programElementRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { FindEducationProgramService } from '@modules/education-program/application/find-education-program.service';
import { Random } from '@core/test/random';
import {
  mockEducationProgramInstance,
  mockTestProgramElementInstance,
} from '@modules/education-program/domain/education-program.entity.spec';

const helpers = new TestHelper(educationProgramRepositoryMockProvider, programElementRepositoryMockProvider);

describe('FindEducationProgramService', () => {
  let findEducationProgramService: FindEducationProgramService;

  beforeAll(async () => {
    [findEducationProgramService] = await helpers.beforeAll([FindEducationProgramService]);
  });

  test('Should return all education programs and count', async () => {
    const result = await findEducationProgramService.findAll({});

    expect(result).toEqual([[mockEducationProgramInstance], Random.number]);
  });

  test('Should return education program by id', async () => {
    const result = await findEducationProgramService.findById(Random.id);

    expect(result).toEqual(mockEducationProgramInstance);
  });

  test('Should return education program by id with query', async () => {
    const result = await findEducationProgramService.findByIdWithQuery(Random.id, {});

    expect(result).toEqual({
      data: {
        ...mockEducationProgramInstance,
        programElements: [mockTestProgramElementInstance],
      },
      total: 1,
    });
  });
});

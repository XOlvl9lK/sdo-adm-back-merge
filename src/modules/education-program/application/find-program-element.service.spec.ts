import { educationElementRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindProgramElementService } from '@modules/education-program/application/find-program-element.service';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { Random } from '@core/test/random';

const helpers = new TestHelper(educationElementRepositoryMockProvider);

describe('FindProgramElementService', () => {
  let findProgramElementService: FindProgramElementService;

  beforeAll(async () => {
    [findProgramElementService] = await helpers.beforeAll([FindProgramElementService]);
  });

  test('Should return all program elements and count', async () => {
    const result = await findProgramElementService.findAll({});

    expect(result).toEqual([[mockTestInstance], Random.number]);
  });
});

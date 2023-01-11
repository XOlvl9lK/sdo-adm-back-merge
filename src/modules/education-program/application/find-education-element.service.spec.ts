import { educationElementRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { FindEducationElementService } from '@modules/education-program/application/find-education-element.service';
import { Random } from '@core/test/random';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';

const helpers = new TestHelper(educationElementRepositoryMockProvider);

describe('FindEducationElementService', () => {
  let findEducationElementService: FindEducationElementService;

  beforeAll(async () => {
    [findEducationElementService] = await helpers.beforeAll([FindEducationElementService]);
  });

  test('Should return all education elements and count', async () => {
    const result = await findEducationElementService.findAll({});

    expect(result).toEqual([[mockTestInstance], Random.number]);
  });
});

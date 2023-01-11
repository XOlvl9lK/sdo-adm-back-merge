import { TestHelper } from '@core/test/test.helper';
import { FindEducationElementService } from '@modules/education-program/application/find-education-element.service';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { EducationElementController } from '@modules/education-program/controllers/education-element.controller';
import { Random } from '@core/test/random';

const helpers = new TestHelper({
  type: 'findService',
  provide: FindEducationElementService,
  mockValue: mockTestInstance,
});

describe('EducationElementController', () => {
  let educationElementController: EducationElementController;

  beforeAll(async () => {
    [educationElementController] = await helpers.beforeAll(
      [EducationElementController],
      [],
      [EducationElementController],
    );
  });

  test('Should return all education elements and count', async () => {
    const result = await educationElementController.getAll({});

    expect(result).toEqual({
      data: [mockTestInstance],
      total: Random.number,
    });
  });
});

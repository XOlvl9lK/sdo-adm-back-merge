import { TestHelper } from '@core/test/test.helper';
import { FindProgramElementService } from '@modules/education-program/application/find-program-element.service';
import { mockTestProgramElementInstance } from '@modules/education-program/domain/education-program.entity.spec';
import { ProgramElementController } from '@modules/education-program/controllers/program-element.controller';
import { Random } from '@core/test/random';

const helpers = new TestHelper({
  type: 'findService',
  provide: FindProgramElementService,
  mockValue: mockTestProgramElementInstance,
});

describe('ProgramElementController', () => {
  let programElementController: ProgramElementController;

  beforeAll(async () => {
    [programElementController] = await helpers.beforeAll([ProgramElementController], [], [ProgramElementController]);
  });

  test('Should return all program elements and count', async () => {
    const result = await programElementController.getAll({});

    expect(result).toEqual({
      total: Random.number,
      data: [mockTestProgramElementInstance],
    });
  });
});

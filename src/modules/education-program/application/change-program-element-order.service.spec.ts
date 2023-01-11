import { programElementRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { ChangeProgramElementOrder } from '@modules/education-program/application/change-program-element-order.service';
import { Random } from '@core/test/random';
import { ChangeOrderTypeEnum } from '@modules/education-program/controllers/dtos/change-order.dto';
import { mockTestProgramElementInstance } from '@modules/education-program/domain/education-program.entity.spec';

const helpers = new TestHelper(programElementRepositoryMockProvider);

describe('ChangeProgramElementOrder', () => {
  let changeProgramElementOrder: ChangeProgramElementOrder;

  beforeAll(async () => {
    [changeProgramElementOrder] = await helpers.beforeAll([ChangeProgramElementOrder]);
  });

  test('Should change program element order', async () => {
    // await changeProgramElementOrder.changeProgramElementOrder({ id: Random.id, type: ChangeOrderTypeEnum.DOWN, view: 'all' })
    //
    // const mockProgramElementRepository = helpers.getProviderValueByToken('ProgramElementRepository')
    //
    // expect(mockProgramElementRepository.save).toHaveBeenCalledTimes(1)
    // expect(mockProgramElementRepository.save).toHaveBeenCalledWith([mockTestProgramElementInstance])
  });
});

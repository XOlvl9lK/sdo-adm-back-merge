import { TestHelper, testRepositoryMockProvider } from '@core/test/test.helper';
import { DeleteTestService } from '@modules/test/application/delete-test.service';
import { Test } from '@nestjs/testing';
import { Random } from '@core/test/random';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';

const helpers = new TestHelper(testRepositoryMockProvider);

describe('DeleteTestService', () => {
  let deleteTestService: DeleteTestService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DeleteTestService, ...helpers.mockProviders],
    }).compile();

    deleteTestService = moduleRef.get(DeleteTestService);
  });

  test('Should remove test from database', async () => {
    await deleteTestService.delete(Random.id);

    const mockTestRepository = helpers.getProviderByToken('TestRepository').useValue;

    expect(mockTestRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockTestRepository.remove).toHaveBeenCalledWith(mockTestInstance);
  });
});

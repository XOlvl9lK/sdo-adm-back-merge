import { educationRequestRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteEducationRequestService } from '@modules/education-request/application/delete-education-request.service';
import { Random } from '@core/test/random';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';

const helpers = new TestHelper(educationRequestRepositoryMockProvider);

describe('DeleteEducationRequestService', () => {
  let deleteEducationRequestService: DeleteEducationRequestService;

  beforeAll(async () => {
    [deleteEducationRequestService] = await helpers.beforeAll([DeleteEducationRequestService]);
  });

  test('Should delete education request', async () => {
    await deleteEducationRequestService.delete(Random.id);

    const mockEducationRequestRepository = helpers.getProviderValueByToken('EducationRequestRepository');

    expect(mockEducationRequestRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockEducationRequestRepository.remove).toHaveBeenCalledWith(mockUserEducationRequestInstance);
  });
});

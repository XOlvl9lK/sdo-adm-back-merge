import { educationProgramRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { DeleteEducationProgramService } from '@modules/education-program/application/delete-education-program.service';
import { Random } from '@core/test/random';
import { mockEducationProgramInstance } from '@modules/education-program/domain/education-program.entity.spec';

const helpers = new TestHelper(educationProgramRepositoryMockProvider);

describe('DeleteEducationProgramService', () => {
  let deleteEducationProgramService: DeleteEducationProgramService;

  beforeAll(async () => {
    [deleteEducationProgramService] = await helpers.beforeAll([DeleteEducationProgramService]);
  });

  test('Should delete education program', async () => {
    await deleteEducationProgramService.delete(Random.id);

    const mockEducationProgramRepository = helpers.getProviderValueByToken('EducationProgramRepository');

    expect(mockEducationProgramRepository.remove).toHaveBeenCalledTimes(1);
    expect(mockEducationProgramRepository.remove).toHaveBeenCalledWith(mockEducationProgramInstance);
  });
});

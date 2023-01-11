import {
  educationElementRepositoryMockProvider,
  programSettingsRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { UpdateProgramSettingsService } from '@modules/program-settings/application/update-program-settings.service';
import { Random } from '@core/test/random';
import { mockTestInstance } from '@modules/test/domain/test.entity.spec';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(programSettingsRepositoryMockProvider, educationElementRepositoryMockProvider);

describe('UpdateProgramSettingsService', () => {
  let updateProgramSettingsService: UpdateProgramSettingsService;

  beforeAll(async () => {
    [updateProgramSettingsService] = await helpers.beforeAll([UpdateProgramSettingsService]);
  });

  test('Should update obligatory and emit', async () => {
    const mockEducationElementRepo = helpers.getProviderValueByToken('EducationElementRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockProgramSettingsRepo = helpers.getProviderValueByToken('ProgramSettingRepository');
    jest
      .spyOn(mockEducationElementRepo, 'findByIds')
      .mockResolvedValue([mockTestInstance, mockTestInstance, mockTestInstance]);

    await updateProgramSettingsService.updateObligatory({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });

    mockProgramSettingsInstance.obligatory = [mockTestInstance, mockTestInstance, mockTestInstance];
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockProgramSettingsRepo.save).toHaveBeenCalledWith(mockProgramSettingsInstance);
  });

  test('Should update optional and emit', async () => {
    const mockEducationElementRepo = helpers.getProviderValueByToken('EducationElementRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockProgramSettingsRepo = helpers.getProviderValueByToken('ProgramSettingRepository');
    jest
      .spyOn(mockEducationElementRepo, 'findByIds')
      .mockResolvedValue([mockTestInstance, mockTestInstance, mockTestInstance]);

    await updateProgramSettingsService.updateOptional({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });

    mockProgramSettingsInstance.optional = [mockTestInstance, mockTestInstance, mockTestInstance];
    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockProgramSettingsRepo.save).toHaveBeenCalledWith(mockProgramSettingsInstance);
  });

  afterEach(() => {
    clearAllMocks();
  });
});

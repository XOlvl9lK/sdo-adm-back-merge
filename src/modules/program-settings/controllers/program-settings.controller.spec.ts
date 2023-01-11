import { ProgramSettingsController } from '@modules/program-settings/controllers/program-settings.controller';
import { CreateProgramSettingsService } from '@modules/program-settings/application/create-program-settings.service';
import { FindProgramSettingsService } from '@modules/program-settings/application/find-program-settings.service';
import { TestHelper } from '@core/test/test.helper';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';
import { UpdateProgramSettingsService } from '@modules/program-settings/application/update-program-settings.service';
import { DeleteProgramSettingsService } from '@modules/program-settings/application/delete-program-settings.service';
import { Random } from '@core/test/random';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(
  {
    type: 'findService',
    provide: FindProgramSettingsService,
    mockValue: mockProgramSettingsInstance,
  },
  { type: 'createService', provide: CreateProgramSettingsService },
  {
    type: 'updateService',
    provide: UpdateProgramSettingsService,
    extend: [
      { method: 'updateObligatory', mockImplementation: jest.fn() },
      { method: 'updateOptional', mockImplementation: jest.fn() },
    ],
  },
  { type: 'deleteService', provide: DeleteProgramSettingsService },
);

describe('ProgramSettingsController', () => {
  let programSettingsController: ProgramSettingsController;

  beforeAll(async () => {
    [programSettingsController] = await helpers.beforeAll([ProgramSettingsController]);
  });

  test('Should return all programSettings', async () => {
    const result = await programSettingsController.findAll({});

    expect(result).toEqual({
      data: [mockProgramSettingsInstance],
      total: Random.number,
    });
  });

  test('Should return programSettings by id', async () => {
    const result = await programSettingsController.getById(Random.id);

    expect(result).toEqual(mockProgramSettingsInstance);
  });

  test('Should call create service', async () => {
    await programSettingsController.create({ roleId: Random.id });

    const mockCreateProgramSettingsService = helpers.getProviderValueByToken('CreateProgramSettingsService');

    expect(mockCreateProgramSettingsService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateProgramSettingsService.create).toHaveBeenCalledWith({
      roleId: Random.id,
    });
  });

  test('Should call update obligatory', async () => {
    await programSettingsController.addObligatory({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });

    const mockUpdateProgramSettingsService = helpers.getProviderValueByToken('UpdateProgramSettingsService');

    expect(mockUpdateProgramSettingsService.updateObligatory).toHaveBeenCalledTimes(1);
    expect(mockUpdateProgramSettingsService.updateObligatory).toHaveBeenCalledWith({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });
  });

  test('Should call update optional', async () => {
    await programSettingsController.addOptional({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });

    const mockUpdateProgramSettingsService = helpers.getProviderValueByToken('UpdateProgramSettingsService');

    expect(mockUpdateProgramSettingsService.updateOptional).toHaveBeenCalledTimes(1);
    expect(mockUpdateProgramSettingsService.updateOptional).toHaveBeenCalledWith({
      programSettingsId: Random.id,
      educationElementIds: Random.ids,
    });
  });

  test('Should call deleteMany', async () => {
    await programSettingsController.deleteMany({
      programSettingsIds: Random.ids,
    });

    const mockDeleteProgramSettings = helpers.getProviderValueByToken('DeleteProgramSettingsService');

    expect(mockDeleteProgramSettings.deleteMany).toHaveBeenCalledTimes(1);
    expect(mockDeleteProgramSettings.deleteMany).toHaveBeenCalledWith({
      programSettingsIds: Random.ids,
    });
  });

  afterEach(() => {
    clearAllMocks();
  });
});

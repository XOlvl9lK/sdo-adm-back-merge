import { TestHelper } from '@core/test/test.helper';
import { CreateEducationProgramService } from '@modules/education-program/application/create-education-program.service';
import { FindEducationProgramService } from '@modules/education-program/application/find-education-program.service';
import {
  mockEducationProgramInstance,
  mockTestProgramElementInstance,
} from '@modules/education-program/domain/education-program.entity.spec';
import { DeleteEducationProgramService } from '@modules/education-program/application/delete-education-program.service';
import { UpdateEducationProgramService } from '@modules/education-program/application/update-education-program.service';
import { EducationProgramController } from '@modules/education-program/controllers/education-program.controller';
import { ChangeProgramElementOrder } from '@modules/education-program/application/change-program-element-order.service';
import { Random } from '@core/test/random';
import { ChangeOrderTypeEnum } from '@modules/education-program/controllers/dtos/change-order.dto';

const helpers = new TestHelper(
  { type: 'createService', provide: CreateEducationProgramService },
  {
    type: 'findService',
    provide: FindEducationProgramService,
    mockValue: mockEducationProgramInstance,
    extend: [
      {
        method: 'findByIdWithQuery',
        mockImplementation: jest.fn().mockResolvedValue({
          data: {
            ...mockEducationProgramInstance,
            programElements: [mockTestProgramElementInstance],
          },
          total: 1,
        }),
      },
    ],
  },
  { type: 'deleteService', provide: DeleteEducationProgramService },
  { type: 'updateService', provide: UpdateEducationProgramService },
);

describe('EducationProgramController', () => {
  let educationProgramController: EducationProgramController;

  beforeAll(async () => {
    [educationProgramController] = await helpers.beforeAll(
      [EducationProgramController],
      [
        {
          provide: ChangeProgramElementOrder,
          useValue: {
            changeProgramElementOrder: jest.fn(),
          },
        },
      ],
      [EducationProgramController],
    );
  });

  test('Should return all education programs and count', async () => {
    const result = await educationProgramController.getAll({});

    expect(result).toEqual({
      data: [mockEducationProgramInstance],
      total: Random.number,
    });
  });

  test('Should return education program by id', async () => {
    const result = await educationProgramController.getById(Random.id);

    expect(result).toEqual(mockEducationProgramInstance);
  });

  test('Should return education program by id with query', async () => {
    const result = await educationProgramController.getByIdWithQuery(Random.id, {});

    expect(result).toEqual({
      data: {
        ...mockEducationProgramInstance,
        programElements: [mockTestProgramElementInstance],
      },
      total: 1,
    });
  });

  test('Should call create', async () => {
    await educationProgramController.create(
      {
        title: Random.lorem,
        educationElementIds: Random.ids,
        selfEnrollmentAllowed: true,
        available: true,
        chapterId: Random.id,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockCreateEducationProgramService = helpers.getProviderValueByToken('CreateEducationProgramService');

    expect(mockCreateEducationProgramService.create).toHaveBeenCalledTimes(1);
    expect(mockCreateEducationProgramService.create).toHaveBeenCalledWith(
      {
        title: Random.lorem,
        educationElementIds: Random.ids,
        selfEnrollmentAllowed: true,
        available: true,
        chapterId: Random.id,
        description: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call update', async () => {
    await educationProgramController.update(
      {
        description: Random.lorem,
        educationElementIds: Random.ids,
        selfEnrollmentAllowed: Random.boolean,
        chapterId: Random.id,
        available: Random.boolean,
        id: Random.id,
        title: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateEducationProgramService = helpers.getProviderValueByToken('UpdateEducationProgramService');

    expect(mockUpdateEducationProgramService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateEducationProgramService.update).toHaveBeenCalledWith(
      {
        description: Random.lorem,
        educationElementIds: Random.ids,
        selfEnrollmentAllowed: Random.boolean,
        chapterId: Random.id,
        available: Random.boolean,
        id: Random.id,
        title: Random.lorem,
      },
      Random.id,
    );
  });

  test('Should call delete', async () => {
    await educationProgramController.delete(Random.id);

    const mockDeleteEducationProgramService = helpers.getProviderValueByToken('DeleteEducationProgramService');

    expect(mockDeleteEducationProgramService.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteEducationProgramService.delete).toHaveBeenCalledWith(Random.id);
  });

  test('Should call changeProgramElementOrder', async () => {
    await educationProgramController.changeOrder({
      id: Random.id,
      type: ChangeOrderTypeEnum.DOWN,
      view: 'all',
    });

    const mockChangeProgramElementService = helpers.getProviderValueByToken('ChangeProgramElementOrder');

    expect(mockChangeProgramElementService.changeProgramElementOrder).toHaveBeenCalledTimes(1);
    expect(mockChangeProgramElementService.changeProgramElementOrder).toHaveBeenCalledWith({
      id: Random.id,
      type: ChangeOrderTypeEnum.DOWN,
      view: 'all',
    });
  });
});

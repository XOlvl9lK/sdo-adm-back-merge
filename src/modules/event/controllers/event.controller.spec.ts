import { TestHelper } from '@core/test/test.helper';
import { EventController } from '@modules/event/controllers/event.controller';
import { mockEventInstance } from '@modules/event/domain/event.entity.mock';
import { Random } from '@core/test/random';
import { DeleteEventService } from '@modules/event/application/delete-event.service';
import { ExportEventService } from '@modules/event/application/export-event.service';
import { FindEventService } from '@modules/event/application/find-event.service';

const helpers = new TestHelper(
  {
    type: 'findService',
    provide: FindEventService,
    mockValue: mockEventInstance,
    extend: [
      {
        method: 'getAll',
        mockImplementation: jest.fn().mockResolvedValue([[mockEventInstance], Random.number]),
      },
    ],
  },
  {
    type: 'deleteService',
    provide: DeleteEventService,
    extend: [{ method: 'deleteAll', mockImplementation: jest.fn() }],
  },
);

describe('EventController', () => {
  let eventController: EventController;

  beforeAll(async () => {
    [eventController] = await helpers.beforeAll(
      [EventController],
      [
        {
          provide: ExportEventService,
          useValue: {
            export: jest.fn(),
          },
        },
      ],
      [EventController],
    );
  });

  test('Should return all events and count', async () => {
    const result = await eventController.getAll({});

    expect(result).toEqual({
      total: Random.number,
      data: [mockEventInstance],
    });
  });

  test('Should call export', async () => {
    await eventController.export({ ids: Random.ids }, helpers.response);

    const mockExportEventService = helpers.getProviderValueByToken('ExportEventService');

    expect(mockExportEventService.export).toHaveBeenCalledTimes(1);
    expect(mockExportEventService.export).toHaveBeenCalledWith(Random.ids, helpers.response);
  });

  test('Should return event by id', async () => {
    const result = await eventController.getById(Random.id);

    expect(result).toEqual(mockEventInstance);
  });

  test('Should call deleteAll', async () => {
    await eventController.deleteAll(Random.id);

    const mockDeleteEventService = helpers.getProviderValueByToken('DeleteEventService');

    expect(mockDeleteEventService.deleteAll).toHaveBeenCalledTimes(1);
    expect(mockDeleteEventService.deleteAll).toHaveBeenCalledWith(Random.id);
  });
});

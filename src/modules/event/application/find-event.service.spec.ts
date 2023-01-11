import { TestHelper } from '@core/test/test.helper';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { mockEventInstance } from '@modules/event/domain/event.entity.mock';
import { FindEventService } from '@modules/event/application/find-event.service';
import { Random } from '@core/test/random';

const helpers = new TestHelper({
  type: 'repository',
  provide: EventRepository,
  mockValue: mockEventInstance,
  extend: [
    {
      method: 'getAll',
      mockImplementation: jest.fn().mockResolvedValue([[mockEventInstance], Random.number]),
    },
  ],
});

describe('FindEventService', () => {
  let findEventService: FindEventService;

  beforeAll(async () => {
    [findEventService] = await helpers.beforeAll([FindEventService]);
  });

  test('Should return all events and count', async () => {
    const result = await findEventService.getAll({});

    expect(result).toEqual([[mockEventInstance], Random.number]);
  });

  test('Should return event by id', async () => {
    const result = await findEventService.findById(Random.id);

    expect(result).toEqual(mockEventInstance);
  });
});

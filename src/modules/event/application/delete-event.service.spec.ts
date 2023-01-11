import { TestHelper } from '@core/test/test.helper';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { mockEventInstance } from '@modules/event/domain/event.entity.mock';
import { DeleteEventService } from '@modules/event/application/delete-event.service';
import { Random } from '@core/test/random';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { TruncateEventEvent } from '@modules/event/infrastructure/events/truncate-event.event';

const helpers = new TestHelper({
  type: 'repository',
  provide: EventRepository,
  mockValue: mockEventInstance,
});

describe('DeleteEventService', () => {
  let deleteEventService: DeleteEventService;

  beforeAll(async () => {
    [deleteEventService] = await helpers.beforeAll([DeleteEventService]);
  });

  test('Should delete all events and emit', async () => {
    await deleteEventService.deleteAll(Random.id);

    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');
    const mockEventRepository = helpers.getProviderValueByToken('EventRepository');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.TRUNCATE_EVENT,
      new TruncateEventEvent(Random.id),
    );
    expect(mockEventRepository.clear).toHaveBeenCalledTimes(1);
  });
});

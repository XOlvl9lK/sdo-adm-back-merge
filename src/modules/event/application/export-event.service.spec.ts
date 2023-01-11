import { TestHelper } from '@core/test/test.helper';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { mockEventInstance } from '@modules/event/domain/event.entity.mock';
import { ExportEventService } from '@modules/event/application/export-event.service';
import { Random } from '@core/test/random';

const helpers = new TestHelper({
  type: 'repository',
  provide: EventRepository,
  mockValue: mockEventInstance,
});

describe('ExportEventService', () => {
  let exportEventService: ExportEventService;

  beforeAll(async () => {
    [exportEventService] = await helpers.beforeAll([ExportEventService]);
  });

  test('File size should greater than 0', async () => {
    await exportEventService.export(Random.ids, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });
});

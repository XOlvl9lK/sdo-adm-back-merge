import { TestHelper } from '@core/test/test.helper';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { mockPageContentInstance } from '@modules/html/domain/page-content.entity.mock';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { UpdateHtmlService } from '@modules/html/application/update-html.service';
import { Random } from '@core/test/random';
import { PageEnum } from '@modules/html/domain/page-content.entity';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';

const helpers = new TestHelper(
  {
    type: 'repository',
    provide: HtmlRepository,
    mockValue: mockPageContentInstance,
    extend: [
      {
        method: 'findAll',
        mockImplementation: jest.fn().mockResolvedValue([mockPageContentInstance]),
      },
      {
        method: 'findByPageType',
        mockImplementation: jest.fn().mockResolvedValue(mockPageContentInstance),
      },
    ],
  },
  { type: 'createService', provide: CreateHtmlService },
);

describe('UpdateHtmlService', () => {
  let updateHtmlService: UpdateHtmlService;

  beforeAll(async () => {
    [updateHtmlService] = await helpers.beforeAll([UpdateHtmlService]);
  });

  test('Should update page and emit', async () => {
    await updateHtmlService.update(
      {
        content: Random.lorem,
        description: Random.lorem,
      },
      PageEnum.MAIN,
      Random.id,
    );

    const mockHtmlRepository = helpers.getProviderValueByToken('HtmlRepository');
    const mockEventEmitter = helpers.getProviderValueByToken('EventEmitter2');

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      EventActionEnum.UPDATE_ENTITY,
      new UpdateEntityEvent(
        `содержание страницы ${PageEnum.MAIN}`,
        Random.id,
        'Управление содержимым',
        mockPageContentInstance,
      ),
    );
    expect(mockHtmlRepository.save).toHaveBeenCalledTimes(1);
    expect(mockHtmlRepository.save).toHaveBeenCalledWith(mockPageContentInstance);
  });
});

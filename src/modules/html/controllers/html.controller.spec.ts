import { TestHelper } from '@core/test/test.helper';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { FindHtmlService } from '@modules/html/application/find-html.service';
import { mockPageContentInstance } from '@modules/html/domain/page-content.entity.mock';
import { HtmlController } from '@modules/html/controllers/html.controller';
import { PageEnum } from '@modules/html/domain/page-content.entity';
import { Random } from '@core/test/random';
import { UpdateHtmlService } from '@modules/html/application/update-html.service';

const helpers = new TestHelper(
  { type: 'createService', provide: CreateHtmlService },
  {
    type: 'findService',
    provide: FindHtmlService,
    mockValue: mockPageContentInstance,
    extend: [
      {
        method: 'findByPageType',
        mockImplementation: jest.fn().mockResolvedValue(mockPageContentInstance),
      },
      {
        method: 'findAll',
        mockImplementation: jest.fn().mockResolvedValue([mockPageContentInstance]),
      },
    ],
  },
  { type: 'updateService', provide: UpdateHtmlService },
);

describe('HtmlController', () => {
  let htmlController: HtmlController;

  beforeAll(async () => {
    [htmlController] = await helpers.beforeAll([HtmlController], [], [HtmlController]);
  });

  test('Should return all pages', async () => {
    const result = await htmlController.getAll({});

    expect(result).toEqual([mockPageContentInstance]);
  });

  test('Should return main page', async () => {
    const result = await htmlController.getMainPage();

    expect(result).toEqual(mockPageContentInstance);
  });

  test('Should return contact page', async () => {
    const result = await htmlController.getContactsPage();

    expect(result).toEqual(mockPageContentInstance);
  });

  test('Should return page by type', async () => {
    const result = await htmlController.getPage(PageEnum.MAIN);

    expect(result).toEqual(mockPageContentInstance);
  });

  test('Should throw if page incorrect', async () => {
    await expect(async () => {
      await htmlController.getPage('asda');
    }).rejects.toThrow();
  });

  test('Should call update', async () => {
    await htmlController.updatePage(
      PageEnum.MAIN,
      {
        content: Random.lorem,
        description: Random.lorem,
      },
      Random.id,
    );

    const mockUpdateHtmlService = helpers.getProviderValueByToken('UpdateHtmlService');

    expect(mockUpdateHtmlService.update).toHaveBeenCalledTimes(1);
    expect(mockUpdateHtmlService.update).toHaveBeenCalledWith(
      {
        content: Random.lorem,
        description: Random.lorem,
      },
      PageEnum.MAIN,
      Random.id,
    );
  });

  test('Should throw if page incorrect', async () => {
    await expect(async () => {
      await htmlController.updatePage(
        'asd',
        {
          content: Random.lorem,
          description: Random.lorem,
        },
        Random.id,
      );
    }).rejects.toThrow();
  });
});

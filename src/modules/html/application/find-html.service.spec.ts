import { TestHelper } from '@core/test/test.helper';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { mockPageContentInstance } from '@modules/html/domain/page-content.entity.mock';
import { FindHtmlService } from '@modules/html/application/find-html.service';
import { PageEnum } from '@modules/html/domain/page-content.entity';

const helpers = new TestHelper({
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
});

describe('FindHtmlService', () => {
  let findHtmlService: FindHtmlService;

  beforeAll(async () => {
    [findHtmlService] = await helpers.beforeAll([FindHtmlService]);
  });

  test('Should return all pages', async () => {
    const result = await findHtmlService.findAll({});

    expect(result).toEqual([mockPageContentInstance]);
  });

  test('Should return page by type', async () => {
    const result = await findHtmlService.findByPageType(PageEnum.MAIN);

    expect(result).toEqual(mockPageContentInstance);
  });
});

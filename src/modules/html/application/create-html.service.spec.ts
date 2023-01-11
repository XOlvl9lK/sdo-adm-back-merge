import { TestHelper } from '@core/test/test.helper';
import { mockPageContentInstance } from '@modules/html/domain/page-content.entity.mock';
import { HtmlRepository } from '@modules/html/infrastructure/database/html.repository';
import { CreateHtmlService } from '@modules/html/application/create-html.service';
import { PageContentEntity, PageEnum } from '@modules/html/domain/page-content.entity';
import { Random } from '@core/test/random';
jest.mock('@modules/html/domain/page-content.entity');
//@ts-ignore
PageContentEntity.mockImplementation(() => mockPageContentInstance);

const helpers = new TestHelper({
  type: 'repository',
  provide: HtmlRepository,
  mockValue: mockPageContentInstance,
});

describe('CreateHtmlService', () => {
  let createHtmlService: CreateHtmlService;

  beforeAll(async () => {
    [createHtmlService] = await helpers.beforeAll([CreateHtmlService]);
  });

  test('Should create page', async () => {
    await createHtmlService.create(
      {
        content: Random.lorem,
        description: Random.lorem,
      },
      PageEnum.MAIN,
    );

    const mockHtmlRepository = helpers.getProviderValueByToken('HtmlRepository');

    expect(mockHtmlRepository.save).toHaveBeenCalledTimes(1);
    expect(mockHtmlRepository.save).toHaveBeenCalledWith(mockPageContentInstance);
  });
});

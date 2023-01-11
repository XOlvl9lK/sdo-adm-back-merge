import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { PageContentEntity, PageEnum } from '@modules/html/domain/page-content.entity';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';

const mockPageContent = {
  ...mockBaseEntity,
  page: PageEnum.MAIN,
  content: Random.lorem,
  description: Random.lorem,
};

export const mockPageContentInstance = plainToInstance(PageContentEntity, mockPageContent);

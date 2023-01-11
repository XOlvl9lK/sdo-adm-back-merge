import { Controller, Param, Post } from '@nestjs/common';
import { ElasticService } from '@modules/elastic/services/elastic.service';

const generateRandomString = (length = 8) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

@Controller('test')
export class TestController {
  constructor(private elasticService: ElasticService) {}

  @Post(':length/:index/:count')
  async post100(@Param('index') index: string, @Param('count') count: string, @Param('length') length: string) {
    const start = Date.now()
    const dataset = Array.from({ length: Number(count) }).map((_, i) => ({ id: i, randomString: generateRandomString(Number(length)) }))
    console.log(dataset.length)
    const res = await this.elasticService.client.bulk({
      operations: dataset.flatMap(doc => [{ index: { _index: index } }, doc]),
      refresh: true,
    });
    const end = Date.now()
    return {
      indexTime: (end - start) + ' ms',
      res
    }
  }
}

import { performanceRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { GeneratePerformanceCertificateService } from '@modules/performance/application/generate-perfomance-certificate.service';
import { Random } from '@core/test/random';

const helpers = new TestHelper(performanceRepositoryMockProvider);

describe('GeneratePerformanceCertificateService', () => {
  let generatePerformanceCertificateService: GeneratePerformanceCertificateService;

  beforeAll(async () => {
    [generatePerformanceCertificateService] = await helpers.beforeAll([GeneratePerformanceCertificateService]);
  });

  test('File size should greater then 0', async () => {
    await generatePerformanceCertificateService.handle(Random.id, helpers.response, 'localhost:3001');

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });
});

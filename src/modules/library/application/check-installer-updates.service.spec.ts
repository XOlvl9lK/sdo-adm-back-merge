import { libraryFileRepositoryMockProvider, TestHelper } from '@core/test/test.helper';
import { CheckInstallerUpdatesService } from '@modules/library/application/check-installer-updates.service';
import { DownloadFileService } from '@modules/file/application/download-file.service';
import { Random } from '@core/test/random';
import { format } from 'date-fns';

const helpers = new TestHelper(libraryFileRepositoryMockProvider);

describe('CheckInstallerUpdatesService', () => {
  // let checkInstallerUpdatesService: CheckInstallerUpdatesService
  //
  // beforeAll(async () => {
  //   [checkInstallerUpdatesService] = await helpers.beforeAll(
  //     [CheckInstallerUpdatesService],
  //     [
  //       {
  //         provide: DownloadFileService,
  //         useValue: {
  //           download: jest.fn()
  //         }
  //       }
  //     ]
  //   )
  // })
  //
  // test('Should check updates', async () => {
  //   const result = await checkInstallerUpdatesService.checkUpdates(Random.lorem, Random.datePast.toISOString())
  //
  //   expect(result).toEqual({
  //     armUpdateExists: true,
  //     armVersion: '1.0.0',
  //     metadataUpdateExists: true,
  //     metadataDate: format(Random.datePast, 'dd.MM.yyyy')
  //   })
  // })
});

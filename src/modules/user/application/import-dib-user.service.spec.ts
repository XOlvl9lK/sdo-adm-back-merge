import {
  departmentRepositoryMockProvider,
  groupRepositoryMockProvider,
  regionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  roleRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  TestHelper,
  userRepositoryMockProvider,
} from '@core/test/test.helper';
import { ImportDibUserService } from '@modules/user/application/import-dib-user.service';
import { Test } from '@nestjs/testing';
import { CreateUserService } from '@modules/user/application/create-user.service';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

const helpers = new TestHelper(
  userRepositoryMockProvider,
  roleRepositoryMockProvider,
  departmentRepositoryMockProvider,
  regionRepositoryMockProvider,
  subdivisionRepositoryMockProvider,
  roleDibRepositoryMockProvider,
  groupRepositoryMockProvider,
);

describe('ImportDibUserService', () => {
  let importDibUserService: ImportDibUserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ImportDibUserService,
        ...helpers.mockProviders,
        helpers.eventEmitterMockProvider,
        {
          provide: CreateUserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUserInstance),
          },
        },
      ],
    }).compile();

    importDibUserService = moduleRef.get(ImportDibUserService);
  });

  test('a', async () => {
    expect('a').toBe('a');
  });
});

import { TestHelper } from '@core/test/test.helper';
import { MultipleEntitiesController } from '@modules/other/controllers/multiple-entities.controller';
import { FindMultipleEntitiesService } from '@modules/other/application/find-multiple-entities.service';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { mockGroupInstance } from '@modules/group/domain/group.entity.spec';

const helpers = new TestHelper();

describe('MultipleEntitiesController', () => {
  let multipleEntitiesController: MultipleEntitiesController;

  beforeAll(async () => {
    [multipleEntitiesController] = await helpers.beforeAll(
      [MultipleEntitiesController],
      [
        {
          provide: FindMultipleEntitiesService,
          useValue: {
            findAllGroupsAndUsers: jest.fn().mockResolvedValue(
              [mockUserInstance, mockGroupInstance].map(el => ({
                ...el,
                type: 'title' in el ? 'GROUP' : 'USER',
              })),
            ),
          },
        },
      ],
      [MultipleEntitiesController],
    );
  });

  test('Should return all groups and users', async () => {
    const result = await multipleEntitiesController.getAllGroupsAndUsers({});

    expect(result).toEqual({
      data: [mockUserInstance, mockGroupInstance].map(el => ({
        ...el,
        type: 'title' in el ? 'GROUP' : 'USER',
      })),
      total: 2,
    });
  });
});

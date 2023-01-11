import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';

const mockUserInGroup = {
  user: mockUserInstance,
  group: plainToInstance(GroupEntity, {
    ...mockBaseEntity,
    title: Random.lorem,
    description: Random.lorem,
  }),
};

export const mockUserInGroupInstance = plainToInstance(UserInGroupEntity, mockUserInGroup);

const mockGroup = {
  ...mockBaseEntity,
  title: Random.lorem,
  description: Random.lorem,
  users: [mockUserInGroupInstance],
  totalUsers: 1,
};

export const mockGroupInstance = plainToInstance(GroupEntity, mockGroup);

describe('GroupEntity', () => {
  test('Should add user', () => {
    mockGroupInstance.addUser(mockUserInGroupInstance);

    expect(mockGroupInstance.users).toEqual([mockUserInGroupInstance, mockUserInGroupInstance]);
    expect(mockGroupInstance.totalUsers).toBe(2);

    mockGroupInstance.totalUsers = 1;
    mockGroupInstance.users = [mockUserInGroupInstance];
  });
});

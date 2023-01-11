import { RequestGroupingService } from '@modules/education-request/domain/request-grouping.service';
import { mockUserEducationRequestInstance } from '@modules/education-request/domain/education-request.entity.spec';
import { mockUserInstance } from '@modules/user/domain/user.entity.spec';

describe('RequestGroupingService', () => {
  test('Should group requests', () => {
    const result = RequestGroupingService.groupAndCountUsersRequests([
      mockUserEducationRequestInstance,
      mockUserEducationRequestInstance,
    ]);

    expect(result).toEqual([
      {
        user: mockUserInstance,
        totalRequests: 2,
        newRequests: [],
      },
    ]);
  });
});

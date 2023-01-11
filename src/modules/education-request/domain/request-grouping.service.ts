import {
  EducationRequestStatusEnum,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { orderBy } from 'lodash';

export interface IGroupedAndCountedUsersRequests {
  user: UserEntity;
  totalRequests: number;
  newRequests: UserEducationRequestEntity[];
  newRequestsCount: number;
}

export class RequestGroupingService {
  static groupAndCountUsersRequests(userRequests: UserEducationRequestEntity[], sort?: string) {
    let sortKey, sortValue;
    if (sort) {
      const parsedSort = JSON.parse(sort);
      sortKey = Object.keys(parsedSort)[0];
      sortValue = parsedSort[sortKey];
    }
    return orderBy(
      userRequests.reduce<IGroupedAndCountedUsersRequests[]>((result, request) => {
        const userRequest = result.find(o => o.user.id === request.userId);
        if (userRequest) {
          if (request.status === EducationRequestStatusEnum.NOT_PROCESSED) {
            userRequest.newRequests.push(request);
            userRequest.newRequestsCount += 1;
          }
          userRequest.totalRequests += 1;
        } else {
          if (request.status === EducationRequestStatusEnum.NOT_PROCESSED) {
            result.push({
              user: request.user,
              totalRequests: 0,
              newRequests: [request],
              newRequestsCount: 1,
            });
          } else {
            result.push({
              user: request.user,
              totalRequests: 1,
              newRequests: [],
              newRequestsCount: 0,
            });
          }
        }
        return result;
      }, []),
      sortKey,
      sortValue?.toLowerCase(),
    );
  }
}

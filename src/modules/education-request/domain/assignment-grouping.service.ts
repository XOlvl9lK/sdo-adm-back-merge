import { UserEntity } from '@modules/user/domain/user.entity';
import { GroupEntity } from '@modules/group/domain/group.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { EducationRequestOwnerTypeEnum } from '@modules/education-request/domain/education-request.entity';
import { orderBy } from 'lodash';

export interface IGroupedAssignments {
  user?: UserEntity;
  group?: GroupEntity;
  totalAssignments: number;
  ownerType: EducationRequestOwnerTypeEnum;
  id: string;
}


export class AssignmentGroupingService {
  static group(assignments: AssignmentEntity[], sort?: string) {
    let sortKey, sortValue;
    if (sort) {
      const parsedSort = JSON.parse(sort);
      sortKey = Object.keys(parsedSort)[0];
      sortValue = parsedSort[sortKey];
    }
    return orderBy(
      assignments.reduce<IGroupedAssignments[]>((result, assignment) => {
        if (assignment.ownerType === EducationRequestOwnerTypeEnum.USER) {
          const userAssignment = result.find(r => r?.user?.id === assignment?.user?.id);
          if (userAssignment) {
            userAssignment.totalAssignments += 1;
          } else {
            result.push({
              user: assignment.user,
              totalAssignments: 1,
              ownerType: EducationRequestOwnerTypeEnum.USER,
              id: assignment.user.id,
            });
          }
        } else {
          const groupAssignment = result.find(r => {
            return r?.group?.id === assignment?.group?.id;
          });
          if (groupAssignment) {
            groupAssignment.totalAssignments += 1;
          } else {
            result.push({
              group: assignment.group,
              totalAssignments: 1,
              ownerType: EducationRequestOwnerTypeEnum.GROUP,
              id: assignment.group.id,
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

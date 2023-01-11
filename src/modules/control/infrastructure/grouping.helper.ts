import { UserEntity } from '@modules/user/domain/user.entity';
import { EducationProgramPerformanceEntity, PerformanceEntity } from '@modules/performance/domain/performance.entity';
import { RequestQuery } from '@core/libs/types';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';

export interface GroupedPerformance {
  user: UserEntity;
  totalAssignments: number;
}

export interface GroupedUsersByGroupAndAuthority {
  group: GroupEntity;
  region: RegionEntity | { id: string; title: string };
  department: DepartmentEntity | { id: string; title: string };
  subdivision: SubdivisionEntity | { id: string; title: string };
  users: UserInGroupEntity[];
}

export interface GroupedUsersAndCompletedPrograms {
  login: string;
  department_title?: string;
  subdivision_title?: string;
  completed_programs: number;
  createdAt: Date;
}

export class GroupingHelper {
  static groupPerformanceByUsers(performance: PerformanceEntity[], users: UserEntity[]) {
    const groupedApp: GroupedPerformance[] = users.map(user => ({
      user,
      totalAssignments: 0,
    }));
    return performance.reduce<GroupedPerformance[]>((result, p) => {
      const performanceByUser = result.find(o => o.user.id === p.user.id);
      performanceByUser.totalAssignments += 1;
      return result;
    }, groupedApp);
  }

  static paginate<T>(data: T[], { page, pageSize, offset }: RequestQuery): [T[], number] {
    if ((page || offset !== undefined) && pageSize) {
      const skip = offset !== undefined ? Number(offset) : (Number(page) - 1) * Number(pageSize);
      const take = skip + Number(pageSize);
      return [data.slice(skip, take), data.length];
    }
    return [data, data.length];
  }

  static groupUsersByGroupAndAuthority(usersInGroup: UserInGroupEntity[]) {
    return usersInGroup.reduce<GroupedUsersByGroupAndAuthority[]>((result, userInGroup) => {
      const inResult = result.find(
        r =>
          r.region?.id === (userInGroup.user.region?.id || 'empty') &&
          r.subdivision?.id === (userInGroup.user.subdivision?.id || 'empty') &&
          r.department?.id === (userInGroup.user.department?.id || 'empty') &&
          r.group?.id === userInGroup.group?.id,
      );
      if (inResult) {
        inResult.users.push(userInGroup);
      } else {
        result.push({
          users: [userInGroup],
          region: userInGroup.user.region || { id: 'empty', title: '' },
          group: userInGroup.group,
          department: userInGroup.user.department || {
            id: 'empty',
            title: '',
          },
          subdivision: userInGroup.user.subdivision || {
            id: 'empty',
            title: '',
          },
        });
      }
      return result;
    }, []);
  }

  static groupUsersAndCompletedPrograms(users: UserEntity[], completedPrograms: EducationProgramPerformanceEntity[]) {
    return users.reduce<GroupedUsersAndCompletedPrograms[]>((result, user) => {
      const performances = completedPrograms.filter(p => p.user.id === user.id);
      result.push({
        completed_programs: performances.length,
        login: user.login,
        department_title: user.department?.title,
        subdivision_title: user.subdivision?.title,
        createdAt: user.createdAt,
      });
      return result;
    }, []);
  }
}

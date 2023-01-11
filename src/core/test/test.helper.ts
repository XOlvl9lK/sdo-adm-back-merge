import { ILike } from 'typeorm';
import { Constructor } from '@core/libs/types';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import {
  mockDepartmentInstance,
  mockRegionInstance,
  mockRoleDibInstance,
  mockSubdivisionInstance,
  mockUserInstance,
} from '@modules/user/domain/user.entity.spec';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Random } from '@core/test/random';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { mockGroupInstance, mockUserInGroupInstance } from '@modules/group/domain/group.entity.spec';
import { FileRepository } from '@modules/file/infrastructure/database/file.repository';
import { mockFileInstance } from '@modules/file/domain/file.entity.mock';
import {
  QuestionInThemeRepository,
  TestQuestionRepository,
} from '@modules/test/infrastructure/database/test-question.repository';
import { mockSingleTestQuestionInstance } from '@modules/test/domain/test-question.entity.spec';
import {
  TestThemeRepository,
  ThemeInTestRepository,
} from '@modules/test/infrastructure/database/test-theme.repository';
import { mockSingleQuestionInThemeInstance, mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';
import { mockTestInstance, mockThemeInTestInstance } from '@modules/test/domain/test.entity.spec';
import { ChapterRepository } from '@modules/chapter/infrastructure/database/chapter.repository';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { Test } from '@nestjs/testing';
import { mockSessionInstance } from '@modules/user/domain/session.entity.spec';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import {
  EducationRequestRepository,
  GroupEducationRequestRepository,
  UserEducationRequestRepository,
} from '@modules/education-request/infrastructure/database/education-request.repository';
import {
  mockGroupEducationRequestInstance,
  mockUserEducationRequestInstance,
} from '@modules/education-request/domain/education-request.entity.spec';
import {
  CoursePerformanceRepository,
  EducationProgramPerformanceRepository,
  PerformanceRepository,
  TestPerformanceRepository,
} from '@modules/performance/infrastructure/database/performance.repository';
import {
  mockCoursePerformanceInstance,
  mockEducationProgramPerformanceInstance,
  mockTestPerformanceInstance,
} from '@modules/performance/domain/performance.entity.spec';
import {
  AnswerAttemptRepository,
  CourseAttemptRepository,
  TestAttemptRepository,
  TestQuestionAttemptRepository,
} from '@modules/performance/infrastructure/database/attempt.repository';
import {
  mockCourseAttemptInstance,
  mockSingleAnswerAttemptInstance,
  mockSingleTestQuestionAttemptInstance,
  mockTestAttemptInstance,
} from '@modules/performance/domain/attempt.entity.spec';
import { SavedQuestionsOrderRepository } from '@modules/performance/infrastructure/database/saved-questions-order.repository';
import { mockSavedQuestionsOrderInstance } from '@modules/performance/domain/saved-questions-order.entity.spec';
import { Provider, ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { AnswerRepository } from '@modules/test/infrastructure/database/answer.repository';
import { mockSingleAnswerInstance } from '@modules/test/domain/answer.entity.spec';
import { ProgramSettingRepository } from '@modules/program-settings/infrastructure/database/program-setting.repository';
import { mockProgramSettingsInstance } from '@modules/program-settings/domain/program-settings.entity.spec';
import {
  EducationElementRepository,
  EducationProgramRepository,
} from '@modules/education-program/infrastructure/database/education-program.repository';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';
import { mockCourseInstance } from '@modules/course/domain/course.entity.spec';
import {
  mockEducationProgramInstance,
  mockTestProgramElementInstance,
} from '@modules/education-program/domain/education-program.entity.spec';
import { AssignmentRepository } from '@modules/education-request/infrastructure/database/assignment.repository';
import { mockTestAssignmentInstance } from '@modules/education-request/domain/assignment.entity.spec';
import { NewsRepository } from '@modules/news/infrastructure/database/news.repository';
import { mockNewsInstance } from '@modules/news/domain/news.entity.spec';
import { LibraryFileRepository } from '@modules/library/infrastructure/database/library-file.repository';
import { mockInstallerInstance, mockLibraryFileInstance } from '@modules/library/domain/library-file.entity.spec';
import { NewsGroupRepository } from '@modules/news/infrastructure/database/news-group.repository';
import { mockNewsGroupInstance } from '@modules/news/domain/news-group.entity.spec';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { mockMessageInstance } from '@modules/messenger/domain/message.entity.spec';
import {
  ForumMessageRepository,
  ForumRepository,
  ThemeRepository,
} from '@modules/forum/infrastructure/database/forum.repository';
import { mockForumInstance } from '@modules/forum/domain/forum.entity.spec';
import { mockForumMessageInstance } from '@modules/forum/domain/forum-message.entity.spec';
import { mockThemeInstance } from '@modules/forum/domain/theme.entity.spec';
import { ProgramElementRepository } from '@modules/education-program/infrastructure/database/program-element.repository';
import { CourseSettingsRepository } from '@modules/education-program/infrastructure/database/course-settings.repository';
import { mockCourseSettingsInstance } from '@modules/education-program/domain/course-settings.entity.spec';
import { EducationProgramSettingsRepository } from '@modules/education-program/infrastructure/database/education-program-settings.repository';
import { mockEducationProgramSettingsInstance } from '@modules/education-program/domain/education-program-settings.entity.spec';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';
import { mockTestSettingsInstance } from '@modules/education-program/domain/test-settings.entity.spec';
import { CourseSuspendDataRepository } from '@modules/course/infrastructure/database/course-suspend-data.repository';
import { mockCourseSuspendDataInstance } from '@modules/course/domain/course-suspend-data.entity.spec';
import { ArchiverService } from '@modules/archiver/application/archiver.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const archiver = require('archiver');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

type MockProvider<T = any> =
  | {
      type: 'repository';
      provide: Constructor<T>;
      mockValue: any;
      extend?: { method: string; mockImplementation: jest.Mock }[];
    }
  | {
      type: 'findService';
      provide: Constructor<T>;
      mockValue: any;
      extend?: { method: string; mockImplementation: jest.Mock }[];
    }
  | {
      type: 'createService';
      provide: Constructor<T>;
      extend?: { method: string; mockImplementation: jest.Mock }[];
    }
  | {
      type: 'updateService';
      provide: Constructor<T>;
      extend?: { method: string; mockImplementation: jest.Mock }[];
    }
  | {
      type: 'deleteService';
      provide: Constructor<T>;
      extend?: { method: string; mockImplementation: jest.Mock }[];
    };

export class TestHelper {
  readonly mockProviders: {
    token: string;
    provide: Constructor;
    useValue: any;
  }[];
  readonly eventEmitterMockProvider = {
    provide: EventEmitter2,
    useValue: {
      emit: jest.fn(),
    },
  };
  readonly response = httpMocks.createResponse();
  readonly archiverProvider = {
    provide: ArchiverService,
    useValue: {
      zip: jest.fn().mockResolvedValue(archiver('zip', { zlib: { level: 5 } }).finalize()),
    },
  };

  constructor(...providers: MockProvider[]) {
    this.mockProviders = [
      ...this.getMockProviders(providers),
      {
        token: 'EventEmitter2',
        ...this.eventEmitterMockProvider,
      },
      {
        token: 'ArchiverService',
        ...this.archiverProvider,
      },
    ];
  }

  getMockRepository<T>(instance: T, extend?: { method: string; mockImplementation: jest.Mock }[]) {
    return {
      findById: jest.fn().mockResolvedValue(instance),
      findByIds: jest.fn().mockResolvedValue([instance]),
      save: jest.fn().mockImplementation(<S>(args: S) => Promise.resolve(args)),
      findOne: jest.fn().mockResolvedValue(instance),
      find: jest.fn().mockResolvedValue([instance]),
      remove: jest.fn().mockResolvedValue(instance),
      findAll: jest.fn().mockResolvedValue([[instance], Random.number]),
      processViewQuery: jest.fn().mockReturnValue({ isArchived: false }),
      processSortQuery: jest.fn().mockReturnValue({ order: { title: 'ASC' } }),
      processPaginationQuery: jest.fn().mockReturnValue({ skip: 0, take: 10 }),
      processSearchQuery: jest.fn().mockReturnValue({ title: ILike(`%title%`) }),
      processSortQueryRaw: jest.fn().mockReturnValue({ sortKey: 'title', sortValue: 'ASC' }),
      processViewQueryRaw: jest.fn().mockReturnValue('(entity.isArchived = true OR entity.isArchived = false)'),
      clear: jest.fn(),
      ...this.getExtendObject(extend),
    };
  }

  private getMockProviders(mockProviders: MockProvider[]) {
    return mockProviders.map(mp => {
      switch (mp.type) {
        case 'repository':
          return {
            token: mp.provide.name,
            provide: mp.provide,
            useValue: this.getMockRepository(mp.mockValue, mp.extend),
          };
        case 'findService':
          return {
            token: mp.provide.name,
            provide: mp.provide,
            useValue: this.getMockFindService(mp.mockValue, mp.extend),
          };
        case 'createService':
          return {
            token: mp.provide.name,
            provide: mp.provide,
            useValue: { create: jest.fn(), ...this.getExtendObject(mp.extend) },
          };
        case 'updateService':
          return {
            token: mp.provide.name,
            provide: mp.provide,
            useValue: {
              update: jest.fn(),
              ...this.getExtendObject(mp.extend),
            },
          };
        case 'deleteService':
          return {
            token: mp.provide.name,
            provide: mp.provide,
            useValue: {
              delete: jest.fn(),
              deleteMany: jest.fn(),
              ...this.getExtendObject(mp.extend),
            },
          };
      }
    });
  }

  getProviderByToken(token: string) {
    return this.mockProviders.find(mp => mp.token === token);
  }

  getProviderValueByToken(token: string) {
    return this.mockProviders.find(mp => mp.token === token).useValue;
  }

  async beforeAll(services: Constructor[], providers?: Provider[], controllers?: Constructor[]) {
    providers?.forEach(p => {
      this.mockProviders.push({
        token: ((p as ValueProvider).provide as Type).name,
        provide: (p as ValueProvider).provide as Type,
        useValue: (p as ValueProvider).useValue,
      });
    });
    const moduleRef = await Test.createTestingModule({
      controllers,
      providers: [...services, ...this.mockProviders, this.eventEmitterMockProvider],
    }).compile();

    return services.map(p => moduleRef.get(p));
  }

  private getMockFindService<T>(instance: T, extend?: { method: string; mockImplementation: jest.Mock }[]) {
    return {
      findAll: jest.fn().mockResolvedValue([[instance], Random.number]),
      findById: jest.fn().mockResolvedValue(instance),
      ...this.getExtendObject(extend),
    };
  }

  private getExtendObject(extend?: { method: string; mockImplementation: jest.Mock }[]) {
    const extendObject = {};
    extend?.forEach(({ method, mockImplementation }) => {
      extendObject[method] = mockImplementation;
    });
    return extendObject;
  }
}

export const userRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: UserRepository,
  mockValue: mockUserInstance,
  extend: [
    {
      method: 'findByLogin',
      mockImplementation: jest.fn().mockResolvedValue(undefined),
    },
    {
      method: 'findByRoleId',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserInstance], Random.number]),
    },
    {
      method: 'findExcludeRoleId',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserInstance], Random.number]),
    },
    {
      method: 'findByDateFilter',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserInstance], Random.number]),
    },
    {
      method: 'findForReportById',
      mockImplementation: jest.fn().mockResolvedValue(mockUserInstance),
    },
    {
      method: 'findForReport',
      mockImplementation: jest.fn().mockResolvedValue([mockUserInstance]),
    },
  ],
};
export const roleRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: RoleRepository,
  mockValue: mockRoleInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findForDelete',
      mockImplementation: jest.fn().mockResolvedValue([{ ...mockRoleInstance, users: 0 }]),
    },
  ],
};
export const departmentRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: DepartmentRepository,
  mockValue: mockDepartmentInstance,
};
export const regionRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: RegionRepository,
  mockValue: mockRegionInstance,
};
export const subdivisionRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: SubdivisionRepository,
  mockValue: mockSubdivisionInstance,
};
export const roleDibRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: RoleDibRepository,
  mockValue: mockRoleDibInstance,
  extend: [
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockRoleDibInstance]),
    },
  ],
};
export const groupRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: GroupRepository,
  mockValue: mockGroupInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
  ],
};
export const fileRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: FileRepository,
  mockValue: mockFileInstance,
};
export const testQuestionRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestQuestionRepository,
  mockValue: mockSingleTestQuestionInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findExcludingIds',
      mockImplementation: jest.fn().mockResolvedValue([[mockSingleTestQuestionInstance], Random.number]),
    },
  ],
};
export const testThemeRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestThemeRepository,
  mockValue: mockTestThemeInstance,
  extend: [
    {
      method: 'findByIdWithQuestions',
      mockImplementation: jest.fn().mockResolvedValue(mockTestThemeInstance),
    },
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
  ],
};
export const questionInThemeRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: QuestionInThemeRepository,
  mockValue: mockSingleQuestionInThemeInstance,
  extend: [
    {
      method: 'findByThemeId',
      mockImplementation: jest.fn().mockResolvedValue([[mockSingleQuestionInThemeInstance], Random.number]),
    },
    {
      method: 'findByThemeIdForQuestionBank',
      mockImplementation: jest.fn().mockResolvedValue([[mockSingleQuestionInThemeInstance], Random.number]),
    },
    {
      method: 'findByQuestionId',
      mockImplementation: jest.fn().mockResolvedValue(mockSingleQuestionInThemeInstance),
    },
    {
      method: 'findByIdsWithTheme',
      mockImplementation: jest.fn().mockResolvedValue([mockSingleQuestionInThemeInstance]),
    },
  ],
};
export const testRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestRepository,
  mockValue: mockTestInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findByIdWithThemes',
      mockImplementation: jest.fn().mockResolvedValue(mockTestInstance),
    },
    {
      method: 'findByIdWithRelations',
      mockImplementation: jest.fn().mockResolvedValue(mockTestInstance),
    },
  ],
};
export const chapterRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ChapterRepository,
  mockValue: mockChapterInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findAllWithoutPagination',
      mockImplementation: jest.fn().mockResolvedValue([mockChapterInstance]),
    },
  ],
};
export const themeInTestRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ThemeInTestRepository,
  mockValue: mockThemeInTestInstance,
  extend: [
    {
      method: 'findByTestId',
      mockImplementation: jest.fn().mockResolvedValue([[mockThemeInTestInstance], Random.number]),
    },
  ],
};
export const sessionMockProvider: MockProvider = {
  type: 'repository',
  provide: SessionRepository,
  mockValue: mockSessionInstance,
  extend: [
    {
      method: 'findByUserId',
      mockImplementation: jest.fn().mockResolvedValue(mockSessionInstance),
    },
  ],
};
export const userEducationRequestRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: UserEducationRequestRepository,
  mockValue: mockUserEducationRequestInstance,
  extend: [
    {
      method: 'findByUserIdAndEducationElementId',
      mockImplementation: jest.fn().mockResolvedValue([mockUserEducationRequestInstance]),
    },
    {
      method: 'findByUserIdAndStatus',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
    },
    {
      method: 'findByUserId',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserEducationRequestInstance], Random.number]),
    },
    {
      method: 'findAllUsersRequests',
      mockImplementation: jest.fn().mockResolvedValue([mockUserEducationRequestInstance]),
    },
    {
      method: 'findByUserIdAndStatusWithoutCount',
      mockImplementation: jest.fn().mockResolvedValue([mockUserEducationRequestInstance]),
    },
  ],
};
export const testPerformanceRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestPerformanceRepository,
  mockValue: mockTestPerformanceInstance,
  extend: [
    {
      method: 'findByIdWithAllRelations',
      mockImplementation: jest.fn().mockResolvedValue(mockTestPerformanceInstance),
    },
    {
      method: 'findByIdWithLastAttempt',
      mockImplementation: jest.fn().mockResolvedValue(mockTestPerformanceInstance),
    },
    {
      method: 'findByIdWithSettings',
      mockImplementation: jest.fn().mockResolvedValue(mockTestPerformanceInstance),
    },
  ],
};
export const testAttemptRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestAttemptRepository,
  mockValue: mockTestAttemptInstance,
  extend: [
    {
      method: 'findByPerformanceId',
      mockImplementation: jest.fn().mockResolvedValue([mockTestAttemptInstance]),
    },
  ],
};
export const savedQuestionsOrderRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: SavedQuestionsOrderRepository,
  mockValue: mockSavedQuestionsOrderInstance,
  extend: [
    {
      method: 'findByPerformanceId',
      mockImplementation: jest.fn().mockResolvedValue([mockSavedQuestionsOrderInstance]),
    },
  ],
};
export const testQuestionAttemptRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestQuestionAttemptRepository,
  mockValue: mockSingleTestQuestionAttemptInstance,
};
export const answerRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: AnswerRepository,
  mockValue: mockSingleAnswerInstance,
};
export const answerAttemptRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: AnswerAttemptRepository,
  mockValue: mockSingleAnswerAttemptInstance,
};
export const educationProgramPerformanceRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: EducationProgramPerformanceRepository,
  mockValue: mockEducationProgramPerformanceInstance,
};
export const performanceRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: PerformanceRepository,
  mockValue: mockTestPerformanceInstance,
  extend: [
    {
      method: 'findByPerformanceId',
      mockImplementation: jest.fn().mockResolvedValue([mockTestPerformanceInstance]),
    },
    {
      method: 'findByUserId',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
    },
    {
      method: 'findUserTimeTable',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
    },
    {
      method: 'findGroupProgramPerformance',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
    },
    {
      method: 'findForOpenSessionsReport',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
    },
    {
      method: 'findByUserIds',
      mockImplementation: jest.fn().mockResolvedValue([mockTestPerformanceInstance]),
    },
    {
      method: 'findForReportUser',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestPerformanceInstance], Random.number]),
    },
  ],
};
export const programSettingsRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ProgramSettingRepository,
  mockValue: mockProgramSettingsInstance,
};
export const educationElementRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: EducationElementRepository,
  mockValue: mockTestInstance,
  extend: [
    {
      method: 'findLast',
      mockImplementation: jest.fn().mockResolvedValue([mockTestInstance]),
    },
    {
      method: 'findAllProgramElements',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestInstance], Random.number]),
    },
  ],
};
export const coursePerformanceRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: CoursePerformanceRepository,
  mockValue: mockCoursePerformanceInstance,
  extend: [
    {
      method: 'findByIdWithAttempt',
      mockImplementation: jest.fn().mockResolvedValue(mockCoursePerformanceInstance),
    },
  ],
};
export const courseRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: CourseRepository,
  mockValue: mockCourseInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
  ],
};
export const educationProgramRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: EducationProgramRepository,
  mockValue: mockEducationProgramInstance,
  extend: [
    {
      method: 'findByIdWithProgramElementsAndSettings',
      mockImplementation: jest.fn().mockResolvedValue(mockEducationProgramInstance),
    },
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findByIdWithProgramElements',
      mockImplementation: jest.fn().mockResolvedValue(mockEducationProgramInstance),
    },
  ],
};
export const assignmentRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: AssignmentRepository,
  mockValue: mockTestAssignmentInstance,
  extend: [
    {
      method: 'findByIdWithSettings',
      mockImplementation: jest.fn().mockResolvedValue(mockTestAssignmentInstance),
    },
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockTestAssignmentInstance]),
    },
    {
      method: 'findByGroupIdOrUserId',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestAssignmentInstance], Random.number]),
    },
  ],
};
export const courseAttemptRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: CourseAttemptRepository,
  mockValue: mockCourseAttemptInstance,
  extend: [
    {
      method: 'findByPerformanceId',
      mockImplementation: jest.fn().mockResolvedValue([mockCourseAttemptInstance]),
    },
  ],
};
export const newsRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: NewsRepository,
  mockValue: mockNewsInstance,
  extend: [
    {
      method: 'findLast',
      mockImplementation: jest.fn().mockResolvedValue([mockNewsInstance]),
    },
    {
      method: 'findByNewsGroupId',
      mockImplementation: jest.fn().mockResolvedValue([[mockNewsInstance], Random.number]),
    },
  ],
};
export const libraryFileRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: LibraryFileRepository,
  mockValue: mockLibraryFileInstance,
  extend: [
    {
      method: 'findLast',
      mockImplementation: jest.fn().mockResolvedValue([mockLibraryFileInstance]),
    },
    {
      method: 'findGreaterThenVersion',
      mockImplementation: jest.fn().mockResolvedValue(mockInstallerInstance),
    },
    {
      method: 'findMetadataGreaterThenDate',
      mockImplementation: jest.fn().mockResolvedValue(mockInstallerInstance),
    },
    {
      method: 'findByVersionAndType',
      mockImplementation: jest.fn().mockResolvedValue(mockInstallerInstance),
    },
    {
      method: 'findByTypeAndMetadataDate',
      mockImplementation: jest.fn().mockResolvedValue(mockInstallerInstance),
    },
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findInstallersByType',
      mockImplementation: jest.fn().mockResolvedValue(mockInstallerInstance),
    },
  ],
};
export const newsGroupRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: NewsGroupRepository,
  mockValue: mockNewsGroupInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
  ],
};
export const messageRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: MessageRepository,
  mockValue: mockMessageInstance,
  extend: [
    {
      method: 'findOneDraftById',
      mockImplementation: jest.fn().mockResolvedValue(mockMessageInstance),
    },
    {
      method: 'countMessagesByUser',
      mockImplementation: jest
        .fn()
        .mockReturnValue([
          Promise.resolve(Random.number),
          Promise.resolve(Random.number),
          Promise.resolve(Random.number),
          Promise.resolve(Random.number),
          Promise.resolve(Random.number),
        ]),
    },
    {
      method: 'findIncomingByUser',
      mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
    },
    {
      method: 'findOutgoingByUser',
      mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
    },
    {
      method: 'findDraftByUser',
      mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
    },
    {
      method: 'findBasketByUser',
      mockImplementation: jest.fn().mockResolvedValue([[mockMessageInstance], Random.number]),
    },
    {
      method: 'findNewIncoming',
      mockImplementation: jest.fn().mockResolvedValue(mockMessageInstance),
    },
  ],
};
export const userInGroupRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: UserInGroupRepository,
  mockValue: mockUserInGroupInstance,
  extend: [
    {
      method: 'findByGroupId',
      mockImplementation: jest.fn().mockResolvedValue([[mockUserInGroupInstance], Random.number]),
    },
    {
      method: 'findWithoutGroup',
      mockImplementation: jest.fn().mockResolvedValue([mockUserInGroupInstance]),
    },
    {
      method: 'findForRegisteredReport',
      mockImplementation: jest.fn().mockResolvedValue([mockUserInGroupInstance]),
    },
  ],
};
export const forumRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ForumRepository,
  mockValue: mockForumInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockForumInstance]),
    },
    {
      method: 'findOrdered',
      mockImplementation: jest.fn().mockResolvedValue([mockForumInstance, mockForumInstance]),
    },
  ],
};
export const forumMessageRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ForumMessageRepository,
  mockValue: mockForumMessageInstance,
  extend: [
    {
      method: 'findBySearch',
      mockImplementation: jest.fn().mockResolvedValue([mockForumMessageInstance]),
    },
    {
      method: 'findByThemeId',
      mockImplementation: jest.fn().mockResolvedValue([[mockForumMessageInstance], Random.number]),
    },
    {
      method: 'findTwoLastByThemeId',
      mockImplementation: jest.fn().mockResolvedValue([mockForumMessageInstance, mockForumMessageInstance]),
    },
  ],
};
export const themeRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ThemeRepository,
  mockValue: mockThemeInstance,
  extend: [
    {
      method: 'isAlreadyExists',
      mockImplementation: jest.fn().mockResolvedValue(false),
    },
    {
      method: 'findByForumId',
      mockImplementation: jest.fn().mockResolvedValue([[mockThemeInstance], Random.number]),
    },
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockThemeInstance]),
    },
  ],
};
export const educationRequestRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: EducationRequestRepository,
  mockValue: mockUserEducationRequestInstance,
  extend: [
    {
      method: 'findAll',
      mockImplementation: jest.fn().mockResolvedValue([mockUserEducationRequestInstance]),
    },
  ],
};
export const programElementRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: ProgramElementRepository,
  mockValue: mockTestProgramElementInstance,
  extend: [
    {
      method: 'findByProgramId',
      mockImplementation: jest.fn().mockResolvedValue([[mockTestProgramElementInstance], Random.number]),
    },
  ],
};
export const courseSettingsRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: CourseSettingsRepository,
  mockValue: mockCourseSettingsInstance,
};
export const educationProgramSettingsRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: EducationProgramSettingsRepository,
  mockValue: mockEducationProgramSettingsInstance,
};
export const testSettingsRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: TestSettingsRepository,
  mockValue: mockTestSettingsInstance,
};
export const courseSuspendDataRepositoryMockProvider: MockProvider = {
  type: 'repository',
  provide: CourseSuspendDataRepository,
  mockValue: mockCourseSuspendDataInstance,
  extend: [
    {
      method: 'findByAttemptId',
      mockImplementation: jest.fn().mockResolvedValue(mockCourseSuspendDataInstance),
    },
  ],
};

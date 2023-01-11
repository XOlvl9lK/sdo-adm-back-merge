import { UserEntity } from '@modules/user/domain/user.entity';
import {
  AnswerEntity,
  AssociativeAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
  OrderedAnswerEntity,
  SingleAnswerEntity,
} from '@modules/test/domain/answer.entity';
import { TestEntity, ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import {
  AnswerAttemptEntity,
  AttemptEntity,
  CourseAttemptEntity,
  TestAttemptEntity,
  TestQuestionAttemptEntity,
} from '@modules/performance/domain/attempt.entity';
import {
  CoursePerformanceEntity,
  EducationProgramPerformanceEntity,
  PerformanceEntity,
  TestPerformanceEntity,
} from '@modules/performance/domain/performance.entity';
import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';
import { EducationProgramEntity } from '@modules/education-program/domain/education-program.entity';
import { CourseEntity } from '@modules/course/domain/course.entity';
import { ForumEntity } from '@modules/forum/domain/forum.entity';
import { ForumMessageEntity } from '@modules/forum/domain/forum-message.entity';
import { ThemeEntity } from '@modules/forum/domain/theme.entity';
import { NewsEntity } from '@modules/news/domain/news.entity';
import { MessageEntity } from '@modules/messenger/domain/message.entity';
import { RoleEntity } from '@modules/user/domain/role.entity';
import {
  EducationRequestEntity,
  GroupEducationRequestEntity,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { PageContentEntity } from '@modules/html/domain/page-content.entity';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';
import { FileEntity } from '@src/modules/file/domain/file.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { VerificationDocumentEntity } from '@modules/verification-centre/domain/verification-document.entity';
import { LibraryFileEntity } from '@modules/library/domain/library-file.entity';
import { QuestionInThemeEntity, TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import {
  CourseProgramElementEntity,
  ProgramElementEntity,
  TestProgramElementEntity,
} from '@modules/education-program/domain/program-element.entity';
import { CourseSettingsEntity } from '@modules/education-program/domain/course-settings.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { EducationProgramSettingsEntity } from '@modules/education-program/domain/education-program-settings.entity';
import { PermissionEntity } from '@modules/user/domain/permission.entity';
import { SessionEntity } from '@modules/user/domain/session.entity';
import { EventEntity } from '@modules/event/domain/event.entity';
import { SavedQuestionsOrderEntity } from '@modules/performance/domain/saved-questions-order.entity';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { CourseSuspendDataEntity } from '@modules/course/domain/course-suspend-data.entity';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';
import { ExportTaskEntity } from '@modules/export-task/domain/export-task.entity';
import { IntegrationEntity } from '@modules/integration/domain/integration/integration.entity';
import {
  IntegrationDivisionEntity
} from '@modules/integration/domain/integration-division/integration-division.entity';
import {
  IntegrationCommonSettingEntity
} from '@modules/integration-common-setting/domain/integration-common-setting.entity';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { FileHistoryEntity } from '@modules/file-history/domain/file-history.entity';
import { SmevAttachmentEntity } from '@modules/smev-attachment/domain/smev-attachment.entity';

export const databaseEntities = [
  UserEntity,
  AnswerEntity,
  SingleAnswerEntity,
  AssociativeAnswerEntity,
  OrderedAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
  TestEntity,
  TestQuestionEntity,
  AttemptEntity,
  TestAttemptEntity,
  TestQuestionAttemptEntity,
  PerformanceEntity,
  TestPerformanceEntity,
  CoursePerformanceEntity,
  EducationElementEntity,
  EducationProgramEntity,
  CourseEntity,
  ForumEntity,
  ForumMessageEntity,
  ThemeEntity,
  NewsEntity,
  MessageEntity,
  RoleEntity,
  EducationRequestEntity,
  AnswerAttemptEntity,
  PageContentEntity,
  DepartmentEntity,
  RegionEntity,
  SubdivisionEntity,
  RoleDibEntity,
  GroupEntity,
  UserEducationRequestEntity,
  GroupEducationRequestEntity,
  FileEntity,
  ChapterEntity,
  VerificationDocumentEntity,
  LibraryFileEntity,
  TestThemeEntity,
  ProgramSettingsEntity,
  TestSettingsEntity,
  ProgramElementEntity,
  TestProgramElementEntity,
  CourseProgramElementEntity,
  CourseSettingsEntity,
  ThemeInTestEntity,
  QuestionInThemeEntity,
  AssignmentEntity,
  EducationProgramSettingsEntity,
  EducationProgramPerformanceEntity,
  PermissionEntity,
  CourseAttemptEntity,
  SessionEntity,
  EventEntity,
  UserInGroupEntity,
  SavedQuestionsOrderEntity,
  NewsGroupEntity,
  CourseSuspendDataEntity,
  ApplicationSettingsEntity,
  ExportTaskEntity,
  IntegrationEntity,
  IntegrationDivisionEntity,
  IntegrationCommonSettingEntity,
  SmevHistoryEntity,
  FileHistoryEntity,
  SmevAttachmentEntity,
]

export const databaseConfig = {
  logging: ['error'],
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'sdo',
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  migrationsTableName: 'db_migration',
  migrations: ['dist/core/config/migrations/*{.js, .ts}'],
  cli: {
    migrationsDir: 'src/core/config/migrations',
  },
  seeds: ['src/core/config/seeds/*{.ts,.js}'],
  entities: databaseEntities,
};

export default databaseConfig;

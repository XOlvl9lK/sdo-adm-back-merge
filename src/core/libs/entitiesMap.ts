import { UserEntity } from '@modules/user/domain/user.entity';
import {
  AnswerEntity,
  AssociativeAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
  OrderedAnswerEntity,
  SingleAnswerEntity,
} from '@modules/test/domain/answer.entity';
import { TestEntity } from '@modules/test/domain/test.entity';
import { TestQuestionEntity } from '@modules/test/domain/test-question.entity';
import {
  AnswerAttemptEntity,
  AttemptEntity,
  TestAttemptEntity,
  TestQuestionAttemptEntity,
} from '@modules/performance/domain/attempt.entity';
import {
  CoursePerformanceEntity,
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
import { GroupEntity } from '@modules/group/domain/group.entity';
import { FileEntity } from '@modules/file/domain/file.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { VerificationDocumentEntity } from '@modules/verification-centre/domain/verification-document.entity';
import { LibraryFileEntity } from '@modules/library/domain/library-file.entity';
import { TestThemeEntity } from '@modules/test/domain/test-theme.entity';
import { ProgramSettingsEntity } from '@modules/program-settings/domain/program-settings.entity';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';
import { NewsGroupEntity } from '@modules/news/domain/news-group.entity';
import { ProgramElementEntity } from '@modules/education-program/domain/program-element.entity';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';

export const entitiesMap = {
  user: UserEntity,
  answer: AnswerEntity,
  'single-answer': SingleAnswerEntity,
  'associative-answer': AssociativeAnswerEntity,
  'ordered-answer': OrderedAnswerEntity,
  'multiple-answer': MultipleAnswerEntity,
  'open-answer': OpenAnswerEntity,
  test: TestEntity,
  'test-question': TestQuestionEntity,
  attempt: AttemptEntity,
  'test-attempt': TestAttemptEntity,
  'test-question-attempt': TestQuestionAttemptEntity,
  performance: PerformanceEntity,
  'test-performance': TestPerformanceEntity,
  'course-performance': CoursePerformanceEntity,
  'education-element': EducationElementEntity,
  'education-program': EducationProgramEntity,
  course: CourseEntity,
  forum: ForumEntity,
  'forum-message': ForumMessageEntity,
  theme: ThemeEntity,
  news: NewsEntity,
  'news-group': NewsGroupEntity,
  message: MessageEntity,
  role: RoleEntity,
  'education-request': EducationRequestEntity,
  'answer-attempt': AnswerAttemptEntity,
  'page-content': PageContentEntity,
  department: DepartmentEntity,
  region: RegionEntity,
  subdivision: SubdivisionEntity,
  'role-dib': RoleDibEntity,
  group: GroupEntity,
  'user-education-request': UserEducationRequestEntity,
  'group-education-request': GroupEducationRequestEntity,
  file: FileEntity,
  chapter: ChapterEntity,
  'verification-document': VerificationDocumentEntity,
  'library-file': LibraryFileEntity,
  'test-theme': TestThemeEntity,
  'program-setting': ProgramSettingsEntity,
  'test-settings': TestSettingsEntity,
  'program-element': ProgramElementEntity,
  assignment: AssignmentEntity,
};

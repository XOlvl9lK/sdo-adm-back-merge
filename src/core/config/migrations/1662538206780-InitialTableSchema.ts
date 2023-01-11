import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionEntity } from '@modules/user/domain/permission.entity';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { UserEntity } from '@modules/user/domain/user.entity';
import { ChapterEntity } from '@modules/chapter/domain/chapter.entity';
import { ApplicationSettingsEntity } from '@modules/application-settings/domain/application-settings.entity';
import {
  admin,
  adminRole,
  basicChapter, basicChapterId,
  certificateIssuance,
  listenerRole, maxExportWorkers,
  permissions,
  sdo,
} from '@modules/application-settings/infrastructure/seed-data';

export class InitialTableSchema1662538206780 implements MigrationInterface {
  name = 'InitialTableSchema1662538206780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "code" text NOT NULL, "description" text, CONSTRAINT "UQ_30e166e8c6359970755c5727a23" UNIQUE ("code"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")); COMMENT ON COLUMN "permission"."id" IS 'ID сущности'; COMMENT ON COLUMN "permission"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "permission"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "permission"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "permission"."code" IS 'Код привилегии'; COMMENT ON COLUMN "permission"."description" IS 'Описание привилегии'`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "is_removable" boolean NOT NULL DEFAULT true, "parent_role_id" character varying, "total_users" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")); COMMENT ON COLUMN "role"."id" IS 'ID сущности'; COMMENT ON COLUMN "role"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "role"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "role"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "role"."title" IS 'Наименование контента'; COMMENT ON COLUMN "role"."description" IS 'Описание контента'; COMMENT ON COLUMN "role"."is_removable" IS 'Признак возможности удаления'; COMMENT ON COLUMN "role"."parent_role_id" IS 'ID родительской роли'; COMMENT ON COLUMN "role"."total_users" IS 'Количество пользователей с данной ролью'`,
    );
    await queryRunner.query(
      `CREATE TABLE "department" ("id" character varying NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id")); COMMENT ON COLUMN "department"."id" IS 'ID cущности'; COMMENT ON COLUMN "department"."title" IS 'Наименование ведомства'`,
    );
    await queryRunner.query(
      `CREATE TABLE "region" ("id" character varying NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id")); COMMENT ON COLUMN "region"."id" IS 'ID сущности'; COMMENT ON COLUMN "region"."title" IS 'Наименование региона'`,
    );
    await queryRunner.query(
      `CREATE TABLE "subdivision" ("id" character varying NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_a54e479a9f2510949317ebecddc" PRIMARY KEY ("id")); COMMENT ON COLUMN "subdivision"."id" IS 'ID сущности'; COMMENT ON COLUMN "subdivision"."title" IS 'Наименование подразделения'`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_dib" ("id" character varying NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_509728d6630a77e1915eff7f76d" PRIMARY KEY ("id")); COMMENT ON COLUMN "role_dib"."id" IS 'ID сущности'; COMMENT ON COLUMN "role_dib"."title" IS 'Наименование роли'`,
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "totalUsers" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id")); COMMENT ON COLUMN "group"."id" IS 'ID сущности'; COMMENT ON COLUMN "group"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "group"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "group"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "group"."title" IS 'Наименование контента'; COMMENT ON COLUMN "group"."description" IS 'Описание контента'; COMMENT ON COLUMN "group"."totalUsers" IS 'Количество пользователей'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_in_group_entity" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "groupId" character varying, "userId" character varying, CONSTRAINT "PK_5cb4eb0e263a4acc5bc9916ad7c" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_in_group_entity"."id" IS 'ID сущности'; COMMENT ON COLUMN "user_in_group_entity"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "user_in_group_entity"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "user_in_group_entity"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "user_in_group_entity"."groupId" IS 'ID сущности'; COMMENT ON COLUMN "user_in_group_entity"."userId" IS 'ID сущности'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "login" text NOT NULL, "password" text NOT NULL, "roleId" character varying, "email" text, "firstName" text, "middleName" text, "lastName" text, "fullName" text, "organization" text, "institution" text, "gender" text, "validityFrom" TIMESTAMP, "validityTo" TIMESTAMP, "isPersonalDataRequired" boolean, "departmentId" character varying, "regionId" character varying, "subdivisionId" character varying, "roleDibId" character varying, CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."id" IS 'ID сущности'; COMMENT ON COLUMN "user"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "user"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "user"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "user"."login" IS 'Логин'; COMMENT ON COLUMN "user"."password" IS 'Пароль'; COMMENT ON COLUMN "user"."roleId" IS 'ID роли'; COMMENT ON COLUMN "user"."email" IS 'Почта'; COMMENT ON COLUMN "user"."firstName" IS 'Имя'; COMMENT ON COLUMN "user"."middleName" IS 'Отчество'; COMMENT ON COLUMN "user"."lastName" IS 'Фамилия'; COMMENT ON COLUMN "user"."fullName" IS 'ФИО'; COMMENT ON COLUMN "user"."organization" IS 'Организация'; COMMENT ON COLUMN "user"."institution" IS 'Институт'; COMMENT ON COLUMN "user"."gender" IS 'Пол'; COMMENT ON COLUMN "user"."validityFrom" IS 'Действителен с'; COMMENT ON COLUMN "user"."validityTo" IS 'Действителен по'; COMMENT ON COLUMN "user"."isPersonalDataRequired" IS 'Требуется ли заполнение персональных данных'; COMMENT ON COLUMN "user"."departmentId" IS 'ID ведомства'; COMMENT ON COLUMN "user"."regionId" IS 'ID региона'; COMMENT ON COLUMN "user"."subdivisionId" IS 'ID подразделения'; COMMENT ON COLUMN "user"."roleDibId" IS 'ID ДИБ роли'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."test_question_type_enum" AS ENUM('SINGLE', 'MULTIPLE', 'ORDERED', 'OPEN', 'ASSOCIATIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "test_question" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "type" "public"."test_question_type_enum" NOT NULL DEFAULT 'SINGLE', "authorId" character varying, "parentQuestionId" character varying, "complexity" numeric NOT NULL DEFAULT '0.5', CONSTRAINT "PK_6f63d6e0b0730f3bd1d04f1da1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "test_question"."id" IS 'ID сущности'; COMMENT ON COLUMN "test_question"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "test_question"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "test_question"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "test_question"."title" IS 'Заголовок'; COMMENT ON COLUMN "test_question"."type" IS 'Тип вопроса'; COMMENT ON COLUMN "test_question"."authorId" IS 'ID сложность'; COMMENT ON COLUMN "test_question"."parentQuestionId" IS 'ID родительского вопроса'; COMMENT ON COLUMN "test_question"."complexity" IS 'Сложность'`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "value" text NOT NULL, "type" text NOT NULL, "isCorrect" boolean, "definition" text, "correctAnswer" text, "mistakesAllowed" integer DEFAULT '0', "order" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id")); COMMENT ON COLUMN "answer"."id" IS 'ID сущности'; COMMENT ON COLUMN "answer"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "answer"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "answer"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "answer"."value" IS 'Значение'; COMMENT ON COLUMN "answer"."type" IS 'Тип ответа'; COMMENT ON COLUMN "answer"."isCorrect" IS 'Признак правильности'; COMMENT ON COLUMN "answer"."definition" IS 'Определение'; COMMENT ON COLUMN "answer"."correctAnswer" IS 'Правильный ответ'; COMMENT ON COLUMN "answer"."mistakesAllowed" IS 'Кол-во допустимых ошибок'; COMMENT ON COLUMN "answer"."order" IS 'Порядок'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ec3a69def9f89a993b8f75ee4d" ON "answer" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "chapter" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, CONSTRAINT "PK_275bd1c62bed7dff839680614ca" PRIMARY KEY ("id")); COMMENT ON COLUMN "chapter"."id" IS 'ID сущности'; COMMENT ON COLUMN "chapter"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "chapter"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "chapter"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "chapter"."title" IS 'Наименование контента'; COMMENT ON COLUMN "chapter"."description" IS 'Описание контента'`,
    );
    await queryRunner.query(
      `CREATE TABLE "education_element" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "element_type" text NOT NULL DEFAULT 'COURSE', "chapter_id" character varying, "available" boolean NOT NULL DEFAULT false, "is_self_assignment_available" boolean NOT NULL DEFAULT false, "duration" integer DEFAULT '0', "threshold" integer DEFAULT '0', "totalThemes" integer DEFAULT '0', "totalElements" integer DEFAULT '0', "type" text NOT NULL, CONSTRAINT "PK_b3d7f82fce56cf3d21c59c42411" PRIMARY KEY ("id")); COMMENT ON COLUMN "education_element"."id" IS 'ID сущности'; COMMENT ON COLUMN "education_element"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "education_element"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "education_element"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "education_element"."title" IS 'Наименование контента'; COMMENT ON COLUMN "education_element"."description" IS 'Описание контента'; COMMENT ON COLUMN "education_element"."element_type" IS 'Тип элемента обучения'; COMMENT ON COLUMN "education_element"."chapter_id" IS 'ID главы'; COMMENT ON COLUMN "education_element"."available" IS 'Доступность элемента обучения'; COMMENT ON COLUMN "education_element"."is_self_assignment_available" IS 'Доступность самоназначения'; COMMENT ON COLUMN "education_element"."duration" IS 'Продолжительность элемента обучения'; COMMENT ON COLUMN "education_element"."threshold" IS 'Порог прохождения'; COMMENT ON COLUMN "education_element"."totalThemes" IS 'Кол-во тем'; COMMENT ON COLUMN "education_element"."totalElements" IS 'Количество элементов в программе обучения'; COMMENT ON COLUMN "education_element"."type" IS 'Тип элемента обучения'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_cd5536d91d4f19a6e59f38ee9f" ON "education_element" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "test_theme" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "questionsToDisplay" integer NOT NULL DEFAULT '0', "totalQuestions" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7c8cf7e21a29d91a518e867e3e8" PRIMARY KEY ("id")); COMMENT ON COLUMN "test_theme"."id" IS 'ID сущности'; COMMENT ON COLUMN "test_theme"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "test_theme"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "test_theme"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "test_theme"."title" IS 'Наименование контента'; COMMENT ON COLUMN "test_theme"."description" IS 'Описание контента'; COMMENT ON COLUMN "test_theme"."questionsToDisplay" IS 'Количество выводимых вопросов'; COMMENT ON COLUMN "test_theme"."totalQuestions" IS 'Количество вопросов'`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_in_theme" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "themeId" character varying, "questionId" character varying, "order" integer NOT NULL, CONSTRAINT "PK_bd99d2cbb2631669163b73a8103" PRIMARY KEY ("id")); COMMENT ON COLUMN "question_in_theme"."id" IS 'ID сущности'; COMMENT ON COLUMN "question_in_theme"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "question_in_theme"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "question_in_theme"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "question_in_theme"."themeId" IS 'ID темы вопроса'; COMMENT ON COLUMN "question_in_theme"."questionId" IS 'ID вопроса'; COMMENT ON COLUMN "question_in_theme"."order" IS 'Порядок вывода вопроса'`,
    );
    await queryRunner.query(
      `CREATE TABLE "theme_in_test" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, "themeId" character varying, "testId" character varying, CONSTRAINT "PK_9d4b83d53dff5698e6763c22b16" PRIMARY KEY ("id")); COMMENT ON COLUMN "theme_in_test"."id" IS 'ID сущности'; COMMENT ON COLUMN "theme_in_test"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "theme_in_test"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "theme_in_test"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "theme_in_test"."order" IS 'Порядок вывода темы'; COMMENT ON COLUMN "theme_in_test"."themeId" IS 'ID темы'; COMMENT ON COLUMN "theme_in_test"."testId" IS 'ID теста'`,
    );
    await queryRunner.query(
      `CREATE TABLE "test_settings" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "timeLimit" integer NOT NULL DEFAULT '0', "numberOfAttempts" integer NOT NULL DEFAULT '0', "questionDeliveryFormat" text NOT NULL DEFAULT 'ALL', "questionSelectionType" text NOT NULL DEFAULT 'NEW', "questionMixingType" text NOT NULL DEFAULT 'RANDOM', "answerMixingType" text NOT NULL DEFAULT 'RANDOM', "isCorrectAnswersAvailable" boolean NOT NULL DEFAULT false, "correctAnswersAvailableDate" TIMESTAMP, "maxScore" integer NOT NULL DEFAULT '100', "passingScore" integer NOT NULL DEFAULT '75', "isObligatory" boolean NOT NULL DEFAULT true, "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_172db2ecb9b86197680efbf0cfd" PRIMARY KEY ("id")); COMMENT ON COLUMN "test_settings"."id" IS 'ID сущности'; COMMENT ON COLUMN "test_settings"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "test_settings"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "test_settings"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "test_settings"."timeLimit" IS 'Ограничение времени на тест'; COMMENT ON COLUMN "test_settings"."numberOfAttempts" IS 'Допустимое кол-во попыток'; COMMENT ON COLUMN "test_settings"."questionDeliveryFormat" IS 'Тип выдачи вопроса'; COMMENT ON COLUMN "test_settings"."questionSelectionType" IS 'Тип выбора вопросов в вариант'; COMMENT ON COLUMN "test_settings"."questionMixingType" IS 'Тип перемешивания вопросов в попытке'; COMMENT ON COLUMN "test_settings"."answerMixingType" IS 'Тип перемешивания ответов в попытке'; COMMENT ON COLUMN "test_settings"."isCorrectAnswersAvailable" IS 'Открыть ответы пользователям'; COMMENT ON COLUMN "test_settings"."correctAnswersAvailableDate" IS 'Дата, когда будут доступны правильные ответы'; COMMENT ON COLUMN "test_settings"."maxScore" IS 'Максимальный балл за тест'; COMMENT ON COLUMN "test_settings"."passingScore" IS 'Балл, который необходимо набрать для успешного прохождения теста'; COMMENT ON COLUMN "test_settings"."isObligatory" IS 'Обязательность'; COMMENT ON COLUMN "test_settings"."start_date" IS 'Дата начала действия теста'; COMMENT ON COLUMN "test_settings"."end_date" IS 'Дата окончания действия теста'`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_settings" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "time_limit" integer NOT NULL DEFAULT '0', "number_of_attempts" integer NOT NULL DEFAULT '0', "is_obligatory" boolean NOT NULL DEFAULT true, "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_56912f607c388b005733b234278" PRIMARY KEY ("id")); COMMENT ON COLUMN "course_settings"."id" IS 'ID сущности'; COMMENT ON COLUMN "course_settings"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "course_settings"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "course_settings"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "course_settings"."time_limit" IS 'Продолжительность курса'; COMMENT ON COLUMN "course_settings"."number_of_attempts" IS 'Число попыток'; COMMENT ON COLUMN "course_settings"."is_obligatory" IS 'Обязательность курса'; COMMENT ON COLUMN "course_settings"."start_date" IS 'Дата начала'; COMMENT ON COLUMN "course_settings"."end_date" IS 'Дата завершения'`,
    );
    await queryRunner.query(
      `CREATE TABLE "program_element" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "elementType" text NOT NULL, "order" integer NOT NULL, "courseSettingsId" character varying, "type" text NOT NULL, "educationProgramId" character varying, "testId" character varying, "testSettingsId" character varying, "courseId" character varying, CONSTRAINT "REL_21213d6d73a3f31c45f3c594b4" UNIQUE ("testSettingsId"), CONSTRAINT "REL_b3019dcd146cab37b4fca9ae81" UNIQUE ("courseSettingsId"), CONSTRAINT "PK_3bc5ecdef587dc31499b2b2ad4a" PRIMARY KEY ("id")); COMMENT ON COLUMN "program_element"."id" IS 'ID сущности'; COMMENT ON COLUMN "program_element"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "program_element"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "program_element"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "program_element"."elementType" IS 'Вид элемента программы'; COMMENT ON COLUMN "program_element"."order" IS 'Порядковый номер'; COMMENT ON COLUMN "program_element"."courseSettingsId" IS 'ID настроек курса'; COMMENT ON COLUMN "program_element"."type" IS 'Тип элемента программы'; COMMENT ON COLUMN "program_element"."educationProgramId" IS 'ID сущности'; COMMENT ON COLUMN "program_element"."testId" IS 'ID сущности'; COMMENT ON COLUMN "program_element"."testSettingsId" IS 'ID сущности'; COMMENT ON COLUMN "program_element"."courseId" IS 'ID сущности'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_fb14dda14e6083fd73e7ca4a3f" ON "program_element" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "education_program_settings" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "orderOfStudy" text NOT NULL DEFAULT 'RANDOM', "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_b03b377689a41de76fd91311a1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "education_program_settings"."id" IS 'ID сущности'; COMMENT ON COLUMN "education_program_settings"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "education_program_settings"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "education_program_settings"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "education_program_settings"."orderOfStudy" IS 'Порядок изучения элементов'; COMMENT ON COLUMN "education_program_settings"."start_date" IS 'Дата начала'; COMMENT ON COLUMN "education_program_settings"."end_date" IS 'Дата завершения'`,
    );
    await queryRunner.query(
      `CREATE TABLE "education_request" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "educationElementId" character varying, "status" text, "ownerType" text NOT NULL DEFAULT 'USER', "validityFrom" TIMESTAMP, "validityTo" TIMESTAMP, "userId" character varying, "initiateByUser" boolean DEFAULT true, "groupId" character varying, "type" text NOT NULL, CONSTRAINT "PK_4436dcacb5c07707049da540a71" PRIMARY KEY ("id")); COMMENT ON COLUMN "education_request"."id" IS 'ID сущности'; COMMENT ON COLUMN "education_request"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "education_request"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "education_request"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "education_request"."educationElementId" IS 'ID элемента образовательной программы'; COMMENT ON COLUMN "education_request"."status" IS 'Статус зачисления'; COMMENT ON COLUMN "education_request"."ownerType" IS 'Тип владельца'; COMMENT ON COLUMN "education_request"."validityFrom" IS 'Дата начала действия'; COMMENT ON COLUMN "education_request"."validityTo" IS 'Дата окончания действия'; COMMENT ON COLUMN "education_request"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "education_request"."initiateByUser" IS 'Признак инициализации юзером'; COMMENT ON COLUMN "education_request"."groupId" IS 'ID группы'; COMMENT ON COLUMN "education_request"."type" IS 'Тип заявки на обучение'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_0d24f9865b18f0302fd6605df7" ON "education_request" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "assignment" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "userId" character varying, "groupId" character varying, "educationElementId" character varying, "ownerType" text NOT NULL DEFAULT 'USER', "testSettingsId" character varying, "courseSettingsId" character varying, "educationProgramSettingsId" character varying, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "isObligatory" boolean NOT NULL DEFAULT true, "certificateIssuance" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_bdacb8831bc1a439cbba766c81" UNIQUE ("testSettingsId"), CONSTRAINT "REL_885dffc8d1f521a0d9a72b0bc7" UNIQUE ("courseSettingsId"), CONSTRAINT "REL_0ab34682bdebcf6e0e0b81ce43" UNIQUE ("educationProgramSettingsId"), CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id")); COMMENT ON COLUMN "assignment"."id" IS 'ID сущности'; COMMENT ON COLUMN "assignment"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "assignment"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "assignment"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "assignment"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "assignment"."groupId" IS 'ID группы'; COMMENT ON COLUMN "assignment"."educationElementId" IS 'ID элемента образовательной программы'; COMMENT ON COLUMN "assignment"."ownerType" IS 'Тип владельца'; COMMENT ON COLUMN "assignment"."testSettingsId" IS 'ID Настроек теста'; COMMENT ON COLUMN "assignment"."courseSettingsId" IS 'ID настроек курса'; COMMENT ON COLUMN "assignment"."educationProgramSettingsId" IS 'ID настроек образовательной программы'; COMMENT ON COLUMN "assignment"."startDate" IS 'Дата зачисления'; COMMENT ON COLUMN "assignment"."endDate" IS 'Дата отчисления'; COMMENT ON COLUMN "assignment"."isObligatory" IS 'Обязательность'; COMMENT ON COLUMN "assignment"."certificateIssuance" IS 'Признак выдачи сертификата'`,
    );
    await queryRunner.query(
      `CREATE TABLE "performance" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "userId" character varying, "result" integer NOT NULL DEFAULT '0', "status" text NOT NULL DEFAULT 'Не открывался', "attemptsLeft" integer NOT NULL, "attemptsSpent" integer NOT NULL DEFAULT '0', "elementType" text, "educationElementId" character varying, "lastOpened" TIMESTAMP, "program_element_id" character varying, "performance_id" character varying, "start_date" TIMESTAMP, "complete_date" TIMESTAMP, "testSettingsId" character varying, "courseSettingsId" character varying, "programSettingsId" character varying, "assignmentId" character varying, "testId" character varying, "lastAttemptId" character varying, "courseId" character varying, "educationProgramId" character varying, "type" text NOT NULL, CONSTRAINT "REL_6fd9c066fd413b200754bde4c7" UNIQUE ("lastAttemptId"), CONSTRAINT "PK_bd775d560f1a8d8e0e2e43fc57f" PRIMARY KEY ("id")); COMMENT ON COLUMN "performance"."id" IS 'ID сущности'; COMMENT ON COLUMN "performance"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "performance"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "performance"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "performance"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "performance"."result" IS 'Кол-во баллов'; COMMENT ON COLUMN "performance"."status" IS 'Статус'; COMMENT ON COLUMN "performance"."attemptsLeft" IS 'Оставшееся кол-во попыток'; COMMENT ON COLUMN "performance"."attemptsSpent" IS 'Кол-во потраченных попыток'; COMMENT ON COLUMN "performance"."elementType" IS 'Тип элемента образовательной программы'; COMMENT ON COLUMN "performance"."educationElementId" IS 'ID элемента обучения'; COMMENT ON COLUMN "performance"."lastOpened" IS 'Дата последнего открытия'; COMMENT ON COLUMN "performance"."program_element_id" IS 'ID программы обучения'; COMMENT ON COLUMN "performance"."performance_id" IS 'ID успеваемости программы'; COMMENT ON COLUMN "performance"."start_date" IS 'Дата начала'; COMMENT ON COLUMN "performance"."complete_date" IS 'Дата завершения'; COMMENT ON COLUMN "performance"."testSettingsId" IS 'ID настроек теста'; COMMENT ON COLUMN "performance"."courseSettingsId" IS 'ID настроек курса'; COMMENT ON COLUMN "performance"."programSettingsId" IS 'ID настроек программы обучения'; COMMENT ON COLUMN "performance"."assignmentId" IS 'ID зачисления'; COMMENT ON COLUMN "performance"."testId" IS 'ID теста'; COMMENT ON COLUMN "performance"."lastAttemptId" IS 'ID последней попытки'; COMMENT ON COLUMN "performance"."courseId" IS 'ID курса'; COMMENT ON COLUMN "performance"."educationProgramId" IS 'ID программы обучения'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f7a82d34e34911ec7535ed4b61" ON "performance" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "attempt" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "timeSpent" text, "userId" character varying, "performanceId" character varying NOT NULL, "isClosed" boolean NOT NULL DEFAULT false, "status" text NOT NULL DEFAULT 'Не завершен', "result" integer NOT NULL DEFAULT '0', "endDate" TIMESTAMP, "testId" character varying, "passing_score" integer, "courseId" character varying, "type" text NOT NULL, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id")); COMMENT ON COLUMN "attempt"."id" IS 'ID сущности'; COMMENT ON COLUMN "attempt"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "attempt"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "attempt"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "attempt"."timeSpent" IS 'Время, затраченное на прохождение'; COMMENT ON COLUMN "attempt"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "attempt"."performanceId" IS 'ID успеваемости'; COMMENT ON COLUMN "attempt"."isClosed" IS 'Признак завершения'; COMMENT ON COLUMN "attempt"."status" IS 'Статус'; COMMENT ON COLUMN "attempt"."result" IS 'Количество правильных баллов'; COMMENT ON COLUMN "attempt"."endDate" IS 'Дата завершения'; COMMENT ON COLUMN "attempt"."testId" IS 'ID теста'; COMMENT ON COLUMN "attempt"."passing_score" IS 'Минимальный балл для прохождения'; COMMENT ON COLUMN "attempt"."courseId" IS 'ID курса'; COMMENT ON COLUMN "attempt"."type" IS 'Тип попытки'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_58799251c68a1ee1ca9bb00847" ON "attempt" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "test_question_attempt" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "questionId" character varying NOT NULL, "themeId" text, CONSTRAINT "PK_4b0beed24cd6196f6c6905183e2" PRIMARY KEY ("id")); COMMENT ON COLUMN "test_question_attempt"."id" IS 'ID сущности'; COMMENT ON COLUMN "test_question_attempt"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "test_question_attempt"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "test_question_attempt"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "test_question_attempt"."questionId" IS 'ID вопроса'; COMMENT ON COLUMN "test_question_attempt"."themeId" IS 'ID темы'`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer_attempt" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "answerId" character varying NOT NULL, "isCorrect" boolean, "definition" text, "correctAnswer" text, "order" integer, CONSTRAINT "PK_19d1fa780999ce88def2f8ab8df" PRIMARY KEY ("id")); COMMENT ON COLUMN "answer_attempt"."id" IS 'ID сущности'; COMMENT ON COLUMN "answer_attempt"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "answer_attempt"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "answer_attempt"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "answer_attempt"."answerId" IS 'ID ответа'; COMMENT ON COLUMN "answer_attempt"."isCorrect" IS 'Признак правильности'; COMMENT ON COLUMN "answer_attempt"."definition" IS 'Определение'; COMMENT ON COLUMN "answer_attempt"."correctAnswer" IS 'Правильный ответ'; COMMENT ON COLUMN "answer_attempt"."order" IS 'Порядок'`,
    );
    await queryRunner.query(
      `CREATE TABLE "theme" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "author_id" character varying, "forum_id" character varying, "total_messages" integer NOT NULL DEFAULT '0', "last_message_id" character varying, "is_fixed" boolean NOT NULL DEFAULT false, "is_closed" boolean NOT NULL DEFAULT false, "leavedLinks" text, CONSTRAINT "REL_da9c06e8b2050758e601f7ad5e" UNIQUE ("last_message_id"), CONSTRAINT "PK_c1934d0b4403bf10c1ab0c18166" PRIMARY KEY ("id")); COMMENT ON COLUMN "theme"."id" IS 'ID сущности'; COMMENT ON COLUMN "theme"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "theme"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "theme"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "theme"."title" IS 'Наименование контента'; COMMENT ON COLUMN "theme"."description" IS 'Описание контента'; COMMENT ON COLUMN "theme"."author_id" IS 'ID автора темы'; COMMENT ON COLUMN "theme"."forum_id" IS 'ID Форума'; COMMENT ON COLUMN "theme"."total_messages" IS 'Кол-во сообщений'; COMMENT ON COLUMN "theme"."last_message_id" IS 'Последние сообщение'; COMMENT ON COLUMN "theme"."is_fixed" IS 'Закреплена'; COMMENT ON COLUMN "theme"."is_closed" IS 'Закрыта'; COMMENT ON COLUMN "theme"."leavedLinks" IS 'ID старых тем'`,
    );
    await queryRunner.query(
      `CREATE TABLE "forum_message" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "authorId" character varying, "themeId" character varying, "message" text NOT NULL, "isFixed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_bdf04e2e4ed23139798bbb2c950" PRIMARY KEY ("id")); COMMENT ON COLUMN "forum_message"."id" IS 'ID сущности'; COMMENT ON COLUMN "forum_message"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "forum_message"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "forum_message"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "forum_message"."authorId" IS 'ID автора'; COMMENT ON COLUMN "forum_message"."themeId" IS 'ID темы'; COMMENT ON COLUMN "forum_message"."message" IS 'Сообщение'; COMMENT ON COLUMN "forum_message"."isFixed" IS 'Закреплено'`,
    );
    await queryRunner.query(
      `CREATE TABLE "forum" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "totalThemes" integer NOT NULL DEFAULT '0', "totalMessages" integer NOT NULL DEFAULT '0', "lastMessageId" character varying, "lastRedactedThemeId" character varying, "order" SERIAL, "isDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_e5590ec44284756aebd320854f" UNIQUE ("lastMessageId"), CONSTRAINT "REL_c6ef84d042be6ad5097070f98c" UNIQUE ("lastRedactedThemeId"), CONSTRAINT "PK_ffd925a9b1fa44ab1ce26c9821c" PRIMARY KEY ("id")); COMMENT ON COLUMN "forum"."id" IS 'ID сущности'; COMMENT ON COLUMN "forum"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "forum"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "forum"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "forum"."title" IS 'Наименование контента'; COMMENT ON COLUMN "forum"."description" IS 'Описание контента'; COMMENT ON COLUMN "forum"."totalThemes" IS 'Кол-во тем'; COMMENT ON COLUMN "forum"."totalMessages" IS 'Кол-во сообщений'; COMMENT ON COLUMN "forum"."lastMessageId" IS 'ID последнего сообщения'; COMMENT ON COLUMN "forum"."lastRedactedThemeId" IS 'ID последней отредактированной темы'; COMMENT ON COLUMN "forum"."order" IS 'Порядок'; COMMENT ON COLUMN "forum"."isDeleted" IS 'Удалён'`,
    );
    await queryRunner.query(
      `CREATE TABLE "news_group" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "parent_group_id" character varying, CONSTRAINT "PK_b2566ff8e06ca953d504e3c3e87" PRIMARY KEY ("id")); COMMENT ON COLUMN "news_group"."id" IS 'ID сущности'; COMMENT ON COLUMN "news_group"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "news_group"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "news_group"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "news_group"."title" IS 'Наименование контента'; COMMENT ON COLUMN "news_group"."description" IS 'Описание контента'; COMMENT ON COLUMN "news_group"."parent_group_id" IS 'ID родительской группы новостей'`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text, "preview" text NOT NULL, "content" text NOT NULL, "isPublished" boolean NOT NULL, "publishDate" TIMESTAMP, "news_group_id" character varying NOT NULL, "authorId" character varying, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id")); COMMENT ON COLUMN "news"."id" IS 'ID сущности'; COMMENT ON COLUMN "news"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "news"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "news"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "news"."title" IS 'Заголовок'; COMMENT ON COLUMN "news"."preview" IS 'Предпросмотр контента'; COMMENT ON COLUMN "news"."content" IS 'Контент'; COMMENT ON COLUMN "news"."isPublished" IS 'Опубликовано'; COMMENT ON COLUMN "news"."publishDate" IS 'Дата публикации'; COMMENT ON COLUMN "news"."news_group_id" IS 'ID группы новостей'; COMMENT ON COLUMN "news"."authorId" IS 'ID автора'`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "theme" text NOT NULL, "content" text NOT NULL, "receiverId" character varying, "senderId" character varying, "basketOwnerId" character varying, "status" text NOT NULL, "type" text NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")); COMMENT ON COLUMN "message"."id" IS 'ID сущности'; COMMENT ON COLUMN "message"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "message"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "message"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "message"."theme" IS 'Тема'; COMMENT ON COLUMN "message"."content" IS 'Сообщение'; COMMENT ON COLUMN "message"."receiverId" IS 'ID получателя'; COMMENT ON COLUMN "message"."senderId" IS 'ID отправителя'; COMMENT ON COLUMN "message"."basketOwnerId" IS 'ID владельца корзины'; COMMENT ON COLUMN "message"."status" IS 'Статус сообщения'; COMMENT ON COLUMN "message"."type" IS 'Тип сообщения'`,
    );
    await queryRunner.query(
      `CREATE TABLE "page_content" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "page" text NOT NULL, "content" text NOT NULL, "description" text, CONSTRAINT "UQ_c37811c698fc60d577a8e46943f" UNIQUE ("page"), CONSTRAINT "PK_c2b7b56ba057b319ed037ed878b" PRIMARY KEY ("id")); COMMENT ON COLUMN "page_content"."id" IS 'ID сущности'; COMMENT ON COLUMN "page_content"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "page_content"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "page_content"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "page_content"."page" IS 'Страница'; COMMENT ON COLUMN "page_content"."content" IS 'Контент'; COMMENT ON COLUMN "page_content"."description" IS 'Описание'`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "fileName" text NOT NULL, "extension" text NOT NULL, "mimetype" text NOT NULL, "size" integer NOT NULL, "hash" text, "downloads" text NOT NULL DEFAULT '0', CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "file"."id" IS 'ID сущности'; COMMENT ON COLUMN "file"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "file"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "file"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "file"."fileName" IS 'Наименование файла'; COMMENT ON COLUMN "file"."extension" IS 'Расширение файла'; COMMENT ON COLUMN "file"."mimetype" IS 'MIME файла'; COMMENT ON COLUMN "file"."size" IS 'Размер'; COMMENT ON COLUMN "file"."hash" IS 'Хэш файла'; COMMENT ON COLUMN "file"."downloads" IS 'Кол-во загрузок'`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_document" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "fileId" character varying, "documentType" text NOT NULL, CONSTRAINT "REL_fb01afd5beaa91c8f2a5622849" UNIQUE ("fileId"), CONSTRAINT "PK_11c3a682fe2bdd7105895270995" PRIMARY KEY ("id")); COMMENT ON COLUMN "verification_document"."id" IS 'ID сущности'; COMMENT ON COLUMN "verification_document"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "verification_document"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "verification_document"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "verification_document"."title" IS 'Название'; COMMENT ON COLUMN "verification_document"."fileId" IS 'ID файла'; COMMENT ON COLUMN "verification_document"."documentType" IS 'Тип документа'`,
    );
    await queryRunner.query(
      `CREATE TABLE "library_file" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "title" text NOT NULL, "description" text, "authorId" character varying, "fileId" character varying, "chapterId" character varying, "type" text, "version" text, "metadata_date" TIMESTAMP, "metadata_date_string" text, "changes" text, CONSTRAINT "REL_3e74d85ec716df192e449f6605" UNIQUE ("fileId"), CONSTRAINT "PK_e4deb1216828bd0fe7bd7fc9b48" PRIMARY KEY ("id")); COMMENT ON COLUMN "library_file"."id" IS 'ID сущности'; COMMENT ON COLUMN "library_file"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "library_file"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "library_file"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "library_file"."title" IS 'Название'; COMMENT ON COLUMN "library_file"."description" IS 'Описание'; COMMENT ON COLUMN "library_file"."authorId" IS 'ID автора'; COMMENT ON COLUMN "library_file"."fileId" IS 'ID файла'; COMMENT ON COLUMN "library_file"."chapterId" IS 'ID главы'; COMMENT ON COLUMN "library_file"."type" IS 'Тип'; COMMENT ON COLUMN "library_file"."version" IS 'Версия'; COMMENT ON COLUMN "library_file"."metadata_date" IS 'Дата метаданных'; COMMENT ON COLUMN "library_file"."metadata_date_string" IS 'Дата метаданных (строка)'; COMMENT ON COLUMN "library_file"."changes" IS 'Изменения'`,
    );
    await queryRunner.query(
      `CREATE TABLE "program_settings" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "roleId" character varying, CONSTRAINT "PK_4c10b631033490b3f95e63f0910" PRIMARY KEY ("id")); COMMENT ON COLUMN "program_settings"."id" IS 'ID сущности'; COMMENT ON COLUMN "program_settings"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "program_settings"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "program_settings"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "program_settings"."roleId" IS 'ID ДИБ роли'`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "refresh_token" text NOT NULL, "user_id" character varying, "expiration_date" TIMESTAMP NOT NULL, "ip" text, "last_page" text, "isConnected" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_30e98e8746699fb9af235410af" UNIQUE ("user_id"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")); COMMENT ON COLUMN "session"."id" IS 'ID сущности'; COMMENT ON COLUMN "session"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "session"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "session"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "session"."refresh_token" IS 'Токен для обновления сессии'; COMMENT ON COLUMN "session"."user_id" IS 'ID пользователя'; COMMENT ON COLUMN "session"."expiration_date" IS 'Дата истечения сессии'; COMMENT ON COLUMN "session"."ip" IS 'IP пользователя'; COMMENT ON COLUMN "session"."last_page" IS 'Последняя посещённая страница'; COMMENT ON COLUMN "session"."isConnected" IS 'Признак того, что пользователь в сети'`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "type" text NOT NULL, "page" text NOT NULL, "object" text, "description" text NOT NULL, "auth_data" text, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")); COMMENT ON COLUMN "event"."id" IS 'ID сущности'; COMMENT ON COLUMN "event"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "event"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "event"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "event"."type" IS 'Тип события'; COMMENT ON COLUMN "event"."page" IS 'Страница, на которой произошло событие'; COMMENT ON COLUMN "event"."object" IS 'Описание события'; COMMENT ON COLUMN "event"."description" IS 'Описание события'; COMMENT ON COLUMN "event"."auth_data" IS 'Данные авторизации'`,
    );
    await queryRunner.query(
      `CREATE TABLE "saved_questions_order" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "performanceId" character varying NOT NULL, "questionsOrder" text NOT NULL, "testThemeId" character varying NOT NULL, CONSTRAINT "PK_e51c7fed54e70aa47d2214825f3" PRIMARY KEY ("id")); COMMENT ON COLUMN "saved_questions_order"."id" IS 'ID сущности'; COMMENT ON COLUMN "saved_questions_order"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "saved_questions_order"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "saved_questions_order"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "saved_questions_order"."performanceId" IS 'ID успеваемости'; COMMENT ON COLUMN "saved_questions_order"."questionsOrder" IS 'Порядок вопросов'; COMMENT ON COLUMN "saved_questions_order"."testThemeId" IS 'ID темы теста'`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_suspend_data" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "lesson_status" text, "lesson_locations" text, "suspend_data" text, "userId" text NOT NULL, "attemptId" text NOT NULL, CONSTRAINT "PK_fdd5de975465fc2aa92e8a40c87" PRIMARY KEY ("id")); COMMENT ON COLUMN "course_suspend_data"."id" IS 'ID сущности'; COMMENT ON COLUMN "course_suspend_data"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "course_suspend_data"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "course_suspend_data"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "course_suspend_data"."lesson_status" IS 'Статус лекции'; COMMENT ON COLUMN "course_suspend_data"."lesson_locations" IS 'Раздел лекции'; COMMENT ON COLUMN "course_suspend_data"."suspend_data" IS 'Хэш прогресса'; COMMENT ON COLUMN "course_suspend_data"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "course_suspend_data"."attemptId" IS 'ID попытки'`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "UQ_05d3aaa226b497c02765f79ad7e" UNIQUE ("title"), CONSTRAINT "PK_84c911c1d401de2adbc8060b6d2" PRIMARY KEY ("id")); COMMENT ON COLUMN "application_settings"."id" IS 'ID сущности'; COMMENT ON COLUMN "application_settings"."title" IS 'Название настройки'; COMMENT ON COLUMN "application_settings"."isActive" IS 'активность'`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions_permission" ("roleId" character varying NOT NULL, "permissionId" character varying NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("roleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permissionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_question_answers_answer" ("testQuestionId" character varying NOT NULL, "answerId" character varying NOT NULL, CONSTRAINT "PK_3c5e4ec11450d1021ccd9e21067" PRIMARY KEY ("testQuestionId", "answerId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eed652f60fac7a841a48a2b4d9" ON "test_question_answers_answer" ("testQuestionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_815d3dd35cad7bb30e4d406b9e" ON "test_question_answers_answer" ("answerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "attempt_question_attempts_test_question_attempt" ("attemptId" character varying NOT NULL, "testQuestionAttemptId" character varying NOT NULL, CONSTRAINT "PK_27ddc1f858e011468196914249d" PRIMARY KEY ("attemptId", "testQuestionAttemptId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1187fc9d0707b07c9378201bc" ON "attempt_question_attempts_test_question_attempt" ("attemptId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90b947c174a2714eeac730305b" ON "attempt_question_attempts_test_question_attempt" ("testQuestionAttemptId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_question_attempt_answer_attempts_answer_attempt" ("testQuestionAttemptId" character varying NOT NULL, "answerAttemptId" character varying NOT NULL, CONSTRAINT "PK_3d5c62fb9a6c94d2ea1cb3e0ad9" PRIMARY KEY ("testQuestionAttemptId", "answerAttemptId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e519b14ee30099ea46222c4b1" ON "test_question_attempt_answer_attempts_answer_attempt" ("testQuestionAttemptId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2ec3b41320172878683549292" ON "test_question_attempt_answer_attempts_answer_attempt" ("answerAttemptId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "program_settings_obligatory_education_element" ("programSettingsId" character varying NOT NULL, "educationElementId" character varying NOT NULL, CONSTRAINT "PK_2d8325e1952d4e756d6ecb2234a" PRIMARY KEY ("programSettingsId", "educationElementId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c249194b378d44b2190ae0c68" ON "program_settings_obligatory_education_element" ("programSettingsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_216836fd31f8ac577dfdd60f54" ON "program_settings_obligatory_education_element" ("educationElementId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "program_settings_optional_education_element" ("programSettingsId" character varying NOT NULL, "educationElementId" character varying NOT NULL, CONSTRAINT "PK_613a145bcd70ba99d801e60ccbb" PRIMARY KEY ("programSettingsId", "educationElementId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed0f0e1fb57b78cc526627c21e" ON "program_settings_optional_education_element" ("programSettingsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9be40d8a796c6030f9bc777f8f" ON "program_settings_optional_education_element" ("educationElementId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_00c3d3abc9c407c7a6730ff1e17" FOREIGN KEY ("parent_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_in_group_entity" ADD CONSTRAINT "FK_6a760f08c53913ae0774e3459bb" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_in_group_entity" ADD CONSTRAINT "FK_35127ae5c50874df0460ba3b2e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f1a2565b8f2580a146871cf1142" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1cff725769aba142aee53ee9f4e" FOREIGN KEY ("subdivisionId") REFERENCES "subdivision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b3176971e2c1fda1d472ce0e2fd" FOREIGN KEY ("roleDibId") REFERENCES "role_dib"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question" ADD CONSTRAINT "FK_fcbef9690b22aa4b570f2f5e8a1" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question" ADD CONSTRAINT "FK_f6420f29fb830e33de2680d5fd9" FOREIGN KEY ("parentQuestionId") REFERENCES "test_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "education_element" ADD CONSTRAINT "FK_857317ac8dd03bd84777ebfb909" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_in_theme" ADD CONSTRAINT "FK_b4c8d9c209083a85446b56e4c96" FOREIGN KEY ("themeId") REFERENCES "test_theme"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_in_theme" ADD CONSTRAINT "FK_abcea94fd142252b87246d1ca4c" FOREIGN KEY ("questionId") REFERENCES "test_question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "theme_in_test" ADD CONSTRAINT "FK_ff9efbef41107b6cb3579e3f71d" FOREIGN KEY ("themeId") REFERENCES "test_theme"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "theme_in_test" ADD CONSTRAINT "FK_25e6c4321987318edefb6a34688" FOREIGN KEY ("testId") REFERENCES "education_element"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_178dd86a8045fd8e0d28420e2a2" FOREIGN KEY ("educationProgramId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_14666e1b32eed7ed94792a05fb1" FOREIGN KEY ("testId") REFERENCES "education_element"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47" FOREIGN KEY ("testSettingsId") REFERENCES "test_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_cab3c13ac0ee4eb4fea0db99408" FOREIGN KEY ("courseId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_b3019dcd146cab37b4fca9ae81c" FOREIGN KEY ("courseSettingsId") REFERENCES "course_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_d9f2baab4a5fb608309281a414c" FOREIGN KEY ("educationElementId") REFERENCES "education_element"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_929fceacfb590bd4f1603a8b12e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_50bba76826bbf02c9085057cb2b" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_6a3767a3978e12d882df5184ce5" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_6762b4ab724450dea45d3769802" FOREIGN KEY ("educationElementId") REFERENCES "education_element"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_bdacb8831bc1a439cbba766c81e" FOREIGN KEY ("testSettingsId") REFERENCES "test_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_885dffc8d1f521a0d9a72b0bc7c" FOREIGN KEY ("courseSettingsId") REFERENCES "course_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_0ab34682bdebcf6e0e0b81ce431" FOREIGN KEY ("educationProgramSettingsId") REFERENCES "education_program_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_291678de3e168e70109fd03b526" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_b2aa93db991e28c814917149d25" FOREIGN KEY ("educationElementId") REFERENCES "education_element"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_0a384980b96564a98b8d93f8d2a" FOREIGN KEY ("program_element_id") REFERENCES "program_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_509ec272cd823473a381261981e" FOREIGN KEY ("performance_id") REFERENCES "performance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_964643c09b920c5b42583158e12" FOREIGN KEY ("testSettingsId") REFERENCES "test_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_ef4c93ba32a746a7a2ceae8604a" FOREIGN KEY ("courseSettingsId") REFERENCES "course_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_4647fc07cb9f44e8dbd104e3463" FOREIGN KEY ("programSettingsId") REFERENCES "education_program_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_69aa90c76978f30fe3d95dc22a2" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_a1d60668007154ed7a445bc2a37" FOREIGN KEY ("testId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_6fd9c066fd413b200754bde4c74" FOREIGN KEY ("lastAttemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_83f443770347a488b5465d5810e" FOREIGN KEY ("courseId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "performance" ADD CONSTRAINT "FK_8376fe09dde34544cde18cdc8c9" FOREIGN KEY ("educationProgramId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_dd8844876037b478f5bb859512e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_0cf3dc7f6d7a5262b86610ea3fa" FOREIGN KEY ("performanceId") REFERENCES "performance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_1b56c39955b4b0295152179d2fc" FOREIGN KEY ("testId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_8b267a15ca7242a5cff592a16c0" FOREIGN KEY ("courseId") REFERENCES "education_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_attempt" ADD CONSTRAINT "FK_a981bbefcba8a5eba327e7ca896" FOREIGN KEY ("questionId") REFERENCES "test_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_attempt" ADD CONSTRAINT "FK_6bdd1c98217fe1bbf0478b333b3" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_d4e937758e71a60f3c022c17ca7" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_001134d07a8c39dc2ac0d566e28" FOREIGN KEY ("forum_id") REFERENCES "forum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "theme" ADD CONSTRAINT "FK_da9c06e8b2050758e601f7ad5e7" FOREIGN KEY ("last_message_id") REFERENCES "forum_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forum_message" ADD CONSTRAINT "FK_30a3c12d132fe76172302685609" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forum_message" ADD CONSTRAINT "FK_1b878711e7d8ada3a83c459931f" FOREIGN KEY ("themeId") REFERENCES "theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forum" ADD CONSTRAINT "FK_e5590ec44284756aebd320854f5" FOREIGN KEY ("lastMessageId") REFERENCES "forum_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forum" ADD CONSTRAINT "FK_c6ef84d042be6ad5097070f98c9" FOREIGN KEY ("lastRedactedThemeId") REFERENCES "theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_group" ADD CONSTRAINT "FK_4f81f9239b3f81f3e9eb8d5e3aa" FOREIGN KEY ("parent_group_id") REFERENCES "news_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_8ccbfa27a88725ca78cb3a88c41" FOREIGN KEY ("news_group_id") REFERENCES "news_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7ea94fd29fdd74188529227bffb" FOREIGN KEY ("basketOwnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_document" ADD CONSTRAINT "FK_fb01afd5beaa91c8f2a56228490" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "library_file" ADD CONSTRAINT "FK_73c6352e0c0390c71450ead0e6b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "library_file" ADD CONSTRAINT "FK_3e74d85ec716df192e449f66059" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "library_file" ADD CONSTRAINT "FK_c177c042019fcc90b9bc45fb461" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings" ADD CONSTRAINT "FK_3a51a29dbdf3e69f9755dc4ad76" FOREIGN KEY ("roleId") REFERENCES "role_dib"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_questions_order" ADD CONSTRAINT "FK_ed16225d2274ce0774c2604d4be" FOREIGN KEY ("performanceId") REFERENCES "performance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_questions_order" ADD CONSTRAINT "FK_214538ae20bdf85f57de2bc4079" FOREIGN KEY ("testThemeId") REFERENCES "test_theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_answers_answer" ADD CONSTRAINT "FK_eed652f60fac7a841a48a2b4d9d" FOREIGN KEY ("testQuestionId") REFERENCES "test_question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_answers_answer" ADD CONSTRAINT "FK_815d3dd35cad7bb30e4d406b9e5" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt_question_attempts_test_question_attempt" ADD CONSTRAINT "FK_f1187fc9d0707b07c9378201bc7" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt_question_attempts_test_question_attempt" ADD CONSTRAINT "FK_90b947c174a2714eeac730305b8" FOREIGN KEY ("testQuestionAttemptId") REFERENCES "test_question_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_attempt_answer_attempts_answer_attempt" ADD CONSTRAINT "FK_3e519b14ee30099ea46222c4b1a" FOREIGN KEY ("testQuestionAttemptId") REFERENCES "test_question_attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_attempt_answer_attempts_answer_attempt" ADD CONSTRAINT "FK_f2ec3b41320172878683549292f" FOREIGN KEY ("answerAttemptId") REFERENCES "answer_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_obligatory_education_element" ADD CONSTRAINT "FK_1c249194b378d44b2190ae0c68e" FOREIGN KEY ("programSettingsId") REFERENCES "program_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_obligatory_education_element" ADD CONSTRAINT "FK_216836fd31f8ac577dfdd60f54c" FOREIGN KEY ("educationElementId") REFERENCES "education_element"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_optional_education_element" ADD CONSTRAINT "FK_ed0f0e1fb57b78cc526627c21e6" FOREIGN KEY ("programSettingsId") REFERENCES "program_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_optional_education_element" ADD CONSTRAINT "FK_9be40d8a796c6030f9bc777f8f3" FOREIGN KEY ("educationElementId") REFERENCES "education_element"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "program_settings_optional_education_element" DROP CONSTRAINT "FK_9be40d8a796c6030f9bc777f8f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_optional_education_element" DROP CONSTRAINT "FK_ed0f0e1fb57b78cc526627c21e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_obligatory_education_element" DROP CONSTRAINT "FK_216836fd31f8ac577dfdd60f54c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_settings_obligatory_education_element" DROP CONSTRAINT "FK_1c249194b378d44b2190ae0c68e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_attempt_answer_attempts_answer_attempt" DROP CONSTRAINT "FK_f2ec3b41320172878683549292f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_attempt_answer_attempts_answer_attempt" DROP CONSTRAINT "FK_3e519b14ee30099ea46222c4b1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt_question_attempts_test_question_attempt" DROP CONSTRAINT "FK_90b947c174a2714eeac730305b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt_question_attempts_test_question_attempt" DROP CONSTRAINT "FK_f1187fc9d0707b07c9378201bc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_answers_answer" DROP CONSTRAINT "FK_815d3dd35cad7bb30e4d406b9e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_question_answers_answer" DROP CONSTRAINT "FK_eed652f60fac7a841a48a2b4d9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`,
    );
    await queryRunner.query(`ALTER TABLE "saved_questions_order" DROP CONSTRAINT "FK_214538ae20bdf85f57de2bc4079"`);
    await queryRunner.query(`ALTER TABLE "saved_questions_order" DROP CONSTRAINT "FK_ed16225d2274ce0774c2604d4be"`);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
    await queryRunner.query(`ALTER TABLE "program_settings" DROP CONSTRAINT "FK_3a51a29dbdf3e69f9755dc4ad76"`);
    await queryRunner.query(`ALTER TABLE "library_file" DROP CONSTRAINT "FK_c177c042019fcc90b9bc45fb461"`);
    await queryRunner.query(`ALTER TABLE "library_file" DROP CONSTRAINT "FK_3e74d85ec716df192e449f66059"`);
    await queryRunner.query(`ALTER TABLE "library_file" DROP CONSTRAINT "FK_73c6352e0c0390c71450ead0e6b"`);
    await queryRunner.query(`ALTER TABLE "verification_document" DROP CONSTRAINT "FK_fb01afd5beaa91c8f2a56228490"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7ea94fd29fdd74188529227bffb"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`);
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00"`);
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_8ccbfa27a88725ca78cb3a88c41"`);
    await queryRunner.query(`ALTER TABLE "news_group" DROP CONSTRAINT "FK_4f81f9239b3f81f3e9eb8d5e3aa"`);
    await queryRunner.query(`ALTER TABLE "forum" DROP CONSTRAINT "FK_c6ef84d042be6ad5097070f98c9"`);
    await queryRunner.query(`ALTER TABLE "forum" DROP CONSTRAINT "FK_e5590ec44284756aebd320854f5"`);
    await queryRunner.query(`ALTER TABLE "forum_message" DROP CONSTRAINT "FK_1b878711e7d8ada3a83c459931f"`);
    await queryRunner.query(`ALTER TABLE "forum_message" DROP CONSTRAINT "FK_30a3c12d132fe76172302685609"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_da9c06e8b2050758e601f7ad5e7"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_001134d07a8c39dc2ac0d566e28"`);
    await queryRunner.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_d4e937758e71a60f3c022c17ca7"`);
    await queryRunner.query(`ALTER TABLE "answer_attempt" DROP CONSTRAINT "FK_6bdd1c98217fe1bbf0478b333b3"`);
    await queryRunner.query(`ALTER TABLE "test_question_attempt" DROP CONSTRAINT "FK_a981bbefcba8a5eba327e7ca896"`);
    await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_8b267a15ca7242a5cff592a16c0"`);
    await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_1b56c39955b4b0295152179d2fc"`);
    await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_0cf3dc7f6d7a5262b86610ea3fa"`);
    await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_dd8844876037b478f5bb859512e"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_8376fe09dde34544cde18cdc8c9"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_83f443770347a488b5465d5810e"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_6fd9c066fd413b200754bde4c74"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_a1d60668007154ed7a445bc2a37"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_69aa90c76978f30fe3d95dc22a2"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_4647fc07cb9f44e8dbd104e3463"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_ef4c93ba32a746a7a2ceae8604a"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_964643c09b920c5b42583158e12"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_509ec272cd823473a381261981e"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_0a384980b96564a98b8d93f8d2a"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_b2aa93db991e28c814917149d25"`);
    await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_291678de3e168e70109fd03b526"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_0ab34682bdebcf6e0e0b81ce431"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_885dffc8d1f521a0d9a72b0bc7c"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_bdacb8831bc1a439cbba766c81e"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_6762b4ab724450dea45d3769802"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_6a3767a3978e12d882df5184ce5"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da"`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_50bba76826bbf02c9085057cb2b"`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_929fceacfb590bd4f1603a8b12e"`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_d9f2baab4a5fb608309281a414c"`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_b3019dcd146cab37b4fca9ae81c"`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_cab3c13ac0ee4eb4fea0db99408"`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47"`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_14666e1b32eed7ed94792a05fb1"`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_178dd86a8045fd8e0d28420e2a2"`);
    await queryRunner.query(`ALTER TABLE "theme_in_test" DROP CONSTRAINT "FK_25e6c4321987318edefb6a34688"`);
    await queryRunner.query(`ALTER TABLE "theme_in_test" DROP CONSTRAINT "FK_ff9efbef41107b6cb3579e3f71d"`);
    await queryRunner.query(`ALTER TABLE "question_in_theme" DROP CONSTRAINT "FK_abcea94fd142252b87246d1ca4c"`);
    await queryRunner.query(`ALTER TABLE "question_in_theme" DROP CONSTRAINT "FK_b4c8d9c209083a85446b56e4c96"`);
    await queryRunner.query(`ALTER TABLE "education_element" DROP CONSTRAINT "FK_857317ac8dd03bd84777ebfb909"`);
    await queryRunner.query(`ALTER TABLE "test_question" DROP CONSTRAINT "FK_f6420f29fb830e33de2680d5fd9"`);
    await queryRunner.query(`ALTER TABLE "test_question" DROP CONSTRAINT "FK_fcbef9690b22aa4b570f2f5e8a1"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b3176971e2c1fda1d472ce0e2fd"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1cff725769aba142aee53ee9f4e"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f1a2565b8f2580a146871cf1142"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
    await queryRunner.query(`ALTER TABLE "user_in_group_entity" DROP CONSTRAINT "FK_35127ae5c50874df0460ba3b2e6"`);
    await queryRunner.query(`ALTER TABLE "user_in_group_entity" DROP CONSTRAINT "FK_6a760f08c53913ae0774e3459bb"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_00c3d3abc9c407c7a6730ff1e17"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9be40d8a796c6030f9bc777f8f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ed0f0e1fb57b78cc526627c21e"`);
    await queryRunner.query(`DROP TABLE "program_settings_optional_education_element"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_216836fd31f8ac577dfdd60f54"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1c249194b378d44b2190ae0c68"`);
    await queryRunner.query(`DROP TABLE "program_settings_obligatory_education_element"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f2ec3b41320172878683549292"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3e519b14ee30099ea46222c4b1"`);
    await queryRunner.query(`DROP TABLE "test_question_attempt_answer_attempts_answer_attempt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_90b947c174a2714eeac730305b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f1187fc9d0707b07c9378201bc"`);
    await queryRunner.query(`DROP TABLE "attempt_question_attempts_test_question_attempt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_815d3dd35cad7bb30e4d406b9e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eed652f60fac7a841a48a2b4d9"`);
    await queryRunner.query(`DROP TABLE "test_question_answers_answer"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`);
    await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
    await queryRunner.query(`DROP TABLE "application_settings"`);
    await queryRunner.query(`DROP TABLE "course_suspend_data"`);
    await queryRunner.query(`DROP TABLE "saved_questions_order"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "program_settings"`);
    await queryRunner.query(`DROP TABLE "library_file"`);
    await queryRunner.query(`DROP TABLE "verification_document"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "page_content"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TABLE "news_group"`);
    await queryRunner.query(`DROP TABLE "forum"`);
    await queryRunner.query(`DROP TABLE "forum_message"`);
    await queryRunner.query(`DROP TABLE "theme"`);
    await queryRunner.query(`DROP TABLE "answer_attempt"`);
    await queryRunner.query(`DROP TABLE "test_question_attempt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_58799251c68a1ee1ca9bb00847"`);
    await queryRunner.query(`DROP TABLE "attempt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f7a82d34e34911ec7535ed4b61"`);
    await queryRunner.query(`DROP TABLE "performance"`);
    await queryRunner.query(`DROP TABLE "assignment"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0d24f9865b18f0302fd6605df7"`);
    await queryRunner.query(`DROP TABLE "education_request"`);
    await queryRunner.query(`DROP TABLE "education_program_settings"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fb14dda14e6083fd73e7ca4a3f"`);
    await queryRunner.query(`DROP TABLE "program_element"`);
    await queryRunner.query(`DROP TABLE "course_settings"`);
    await queryRunner.query(`DROP TABLE "test_settings"`);
    await queryRunner.query(`DROP TABLE "theme_in_test"`);
    await queryRunner.query(`DROP TABLE "question_in_theme"`);
    await queryRunner.query(`DROP TABLE "test_theme"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cd5536d91d4f19a6e59f38ee9f"`);
    await queryRunner.query(`DROP TABLE "education_element"`);
    await queryRunner.query(`DROP TABLE "chapter"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ec3a69def9f89a993b8f75ee4d"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "test_question"`);
    await queryRunner.query(`DROP TYPE "public"."test_question_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_in_group_entity"`);
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(`DROP TABLE "role_dib"`);
    await queryRunner.query(`DROP TABLE "subdivision"`);
    await queryRunner.query(`DROP TABLE "region"`);
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}

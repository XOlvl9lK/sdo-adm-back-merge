import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableComments1662538221780 implements MigrationInterface {
  name = 'AddTableComments1662538221780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE public."answer" IS 'Ответы'`);
    await queryRunner.query(`COMMENT ON TABLE public."answer_attempt" IS 'Попытки ответов'`);
    await queryRunner.query(`COMMENT ON TABLE public."application_settings" IS 'Настройки приложения'`);
    await queryRunner.query(`COMMENT ON TABLE public."assignment" IS 'Зачисление'`);
    await queryRunner.query(`COMMENT ON TABLE public."attempt" IS 'Попытки'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."attempt_question_attempts_test_question_attempt" IS 'Связь между попытками и попытками вопросов'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."chapter" IS 'Разделы'`);
    await queryRunner.query(`COMMENT ON TABLE public."course_settings" IS 'Настройки курсов'`);
    await queryRunner.query(`COMMENT ON TABLE public."course_suspend_data" IS 'Параметры прохождения SCORM-курсов'`);
    await queryRunner.query(`COMMENT ON TABLE public."department" IS 'Ведомства'`);
    await queryRunner.query(`COMMENT ON TABLE public."education_element" IS 'Элементы обучения'`);
    await queryRunner.query(`COMMENT ON TABLE public."education_program_settings" IS 'Настройки програм обучения'`);
    await queryRunner.query(`COMMENT ON TABLE public."education_request" IS 'Заявка на зачисление'`);
    await queryRunner.query(`COMMENT ON TABLE public."event" IS 'События'`);
    await queryRunner.query(`COMMENT ON TABLE public."file" IS 'Файлы'`);
    await queryRunner.query(`COMMENT ON TABLE public."forum" IS 'Форумы'`);
    await queryRunner.query(`COMMENT ON TABLE public."forum_message" IS 'Сообщения форумов'`);
    await queryRunner.query(`COMMENT ON TABLE public."group" IS 'Группы'`);
    await queryRunner.query(`COMMENT ON TABLE public."library_file" IS 'Файлы библиотеки'`);
    await queryRunner.query(`COMMENT ON TABLE public."message" IS 'Сообщения'`);
    await queryRunner.query(`COMMENT ON TABLE public."event" IS 'События'`);
    await queryRunner.query(`COMMENT ON TABLE public."news" IS 'Новости'`);
    await queryRunner.query(`COMMENT ON TABLE public."news_group" IS 'Группы новостей'`);
    await queryRunner.query(`COMMENT ON TABLE public."page_content" IS 'Содержимое страниц'`);
    await queryRunner.query(`COMMENT ON TABLE public."performance" IS 'Успеваемость'`);
    await queryRunner.query(`COMMENT ON TABLE public."permission" IS 'Привилегии'`);
    await queryRunner.query(`COMMENT ON TABLE public."program_element" IS 'Элементы программы обучения'`);
    await queryRunner.query(`COMMENT ON TABLE public."program_settings" IS 'Настройки програм обучения'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."program_settings_obligatory_education_element" IS 'Связь между настройками программы обучения и обязательными элементами обучения'`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE public."program_settings_optional_education_element" IS 'Связь между настройками программы обучения и необязательными элементами обучения'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."question_in_theme" IS 'Вопросы в темах'`);
    await queryRunner.query(`COMMENT ON TABLE public."region" IS 'Регионы'`);
    await queryRunner.query(`COMMENT ON TABLE public."role" IS 'Роли'`);
    await queryRunner.query(`COMMENT ON TABLE public."role_dib" IS 'ДИБ роли'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."role_permissions_permission" IS 'Связь между ролями и привилегиями'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."saved_questions_order" IS 'Сохраненный порядок вопросов'`);
    await queryRunner.query(`COMMENT ON TABLE public."session" IS 'Сессии'`);
    await queryRunner.query(`COMMENT ON TABLE public."subdivision" IS 'Подразделения'`);
    await queryRunner.query(`COMMENT ON TABLE public."test_question" IS 'Вопросы тестов'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."test_question_answers_answer" IS 'Связь между вопросами тестов и ответами'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."test_question_attempt" IS 'Попытки ответа на вопросы тестов'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."test_question_attempt_answer_attempts_answer_attempt" IS 'Связь между попытками ответа на вопросы тестов и попытками ответа на вопросы'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."test_settings" IS 'Настройки тестов'`);
    await queryRunner.query(`COMMENT ON TABLE public."test_theme" IS 'Темы тестов'`);
    await queryRunner.query(`COMMENT ON TABLE public."theme" IS 'Темы'`);
    await queryRunner.query(`COMMENT ON TABLE public."theme_in_test" IS 'Темы в тестах'`);
    await queryRunner.query(`COMMENT ON TABLE public."user" IS 'Пользователи'`);
    await queryRunner.query(
      `COMMENT ON TABLE public."user_in_group_entity" IS 'Связь между пользователями и группами'`,
    );
    await queryRunner.query(`COMMENT ON TABLE public."verification_document" IS 'Документы удостоверяющего центра'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

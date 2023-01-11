import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegisteredReportSQLFunctions1672413983324 implements MigrationInterface {
  name = 'AddRegisteredReportSQLFunctions1672413983324'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION registered_report_performance_completed_education_count (text[])
      RETURNS integer
      LANGUAGE plpgsql
      AS $$
      DECLARE 
        user_ids ALIAS FOR $1;
        elem text;
        id_line text = '';
        completed_users integer;
      BEGIN
        FOREACH elem IN ARRAY user_ids LOOP
          id_line = id_line || '''' ||  elem || '''' || ',';
        END LOOP;
        EXECUTE '
          SELECT count(*) FROM (
            SELECT (count(*) < 1) as "isCompleted"  FROM "performance" as "perf"
            LEFT JOIN "assignment" as "perf_as" ON "perf_as"."id" = "perf"."assignmentId"
            WHERE
              "perf"."userId" IN (' || substring(id_line, 1, length(id_line) - 1) || ')
              AND "perf".status IN (''Не начат'', ''Не завершен'', ''Не сдан'', ''В процессе'')
              AND "perf"."performance_id" is NULL
              AND "perf_as"."isObligatory" = true
            GROUP BY
              "perf"."userId"
          ) as inner_result
          WHERE "isCompleted" = true
        ' INTO completed_users; 
        RETURN completed_users;
      END;
      $$;

      CREATE OR REPLACE FUNCTION registered_report_performance_completed_education_count_by_last_month (text[])
      RETURNS integer
      LANGUAGE plpgsql
      AS $$
      DECLARE 
        user_ids ALIAS FOR $1;
        elem text;
        id_line text = '';
        completed_users integer;
      BEGIN
        FOREACH elem IN ARRAY user_ids LOOP
          id_line = id_line || '''' ||  elem || '''' || ',';
        END LOOP;	
        EXECUTE '
          SELECT count(*) FROM (
            SELECT (count(*) < 1) as "isCompleted"  FROM "performance" as "perf"
            LEFT JOIN "assignment" as "perf_as" ON "perf_as"."id" = "perf"."assignmentId"
            WHERE 
              "perf"."userId" IN (' || substring(id_line, 1, length(id_line) - 1) || ')
              AND "perf".status IN (''Не начат'', ''Не завершен'', ''Не сдан'', ''В процессе'')
              AND "perf"."performance_id" is NULL
              AND "perf_as"."isObligatory" = true
              AND "perf"."complete_date" >= date_trunc(''month'', now())::timestamp
              AND "perf"."complete_date" < (date_trunc(''month'', now()) + interval ''1 month'')::timestamp 
            GROUP BY "perf"."userId"
          ) as inner_result
          WHERE "isCompleted" = true
        ' INTO completed_users; 
        RETURN completed_users;
      END;
      $$;

      CREATE OR REPLACE FUNCTION registered_report_performance_registered_in_group_last_month (text, text[])
      RETURNS integer
      LANGUAGE plpgsql
      AS $$
      DECLARE 
        group_id ALIAS FOR $1;
        user_ids ALIAS FOR $2;
        elem text;
        id_line text = '';
        completed_users integer;
      BEGIN
        FOREACH elem IN ARRAY user_ids LOOP
          id_line = id_line || '''' ||  elem || '''' || ',';
        END LOOP;
        EXECUTE '
          SELECT count(*) 
          FROM user_in_group_entity
          WHERE 
            "groupId" = ' || '''' || group_id || '''' || '
            AND "userId" IN (' || substring(id_line, 1, length(id_line) - 1) || ')
            AND "createdAt" >= date_trunc(''month'', now())::timestamp
            AND "createdAt" < (date_trunc(''month'', now()) + interval ''1 month'')::timestamp 
        ' INTO completed_users; 
        RETURN completed_users;
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS registered_report_performance_registered_in_group_last_month;
      DROP FUNCTION IF EXISTS registered_report_performance_completed_education_count_by_last_month;
      DROP FUNCTION IF EXISTS registered_report_performance_completed_education_count;
    `)
  }
}
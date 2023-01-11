import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExportTask1666872192499 implements MigrationInterface {
  name = 'UpdateExportTask1669639377463'

  // Костыль из-за косяка с названиями миграций
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO
      $do$
        BEGIN
          IF NOT EXISTS (SELECT 1 from information_schema.columns WHERE table_schema = 'public' AND table_name = 'export_task' AND column_name = 'fileName') THEN
              ALTER TABLE "export_task" ADD "fileName" character varying;
          END IF;
        END;
      $do$
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "export_task" DROP COLUMN "fileName"`)
  }
}
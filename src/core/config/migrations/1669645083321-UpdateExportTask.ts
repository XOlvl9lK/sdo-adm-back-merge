import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExportTask1669645083321 implements MigrationInterface {
  name = 'UpdateExportTask1669645083321'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "export_task" ADD "progress" integer DEFAULT 0 NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "export_task" DROP COLUMN "progress"`)
  }
}
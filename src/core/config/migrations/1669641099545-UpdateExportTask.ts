import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExportTask1669641099545 implements MigrationInterface {
  name = 'UpdateExportTask1669641099545'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "export_task" ADD "href" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "export_task" DROP COLUMN "href"`)
  }
}
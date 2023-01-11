import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTestTheme1664455178511 implements MigrationInterface {
  name = 'UpdateTestTheme1664455178511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_theme" DROP COLUMN "totalQuestions"`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`ALTER TABLE "test_theme" ADD "totalQuestions" integer NOT NULL DEFAULT '0'`);
  }
}

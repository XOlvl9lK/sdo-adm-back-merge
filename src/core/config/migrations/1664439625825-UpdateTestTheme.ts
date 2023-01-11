import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTestTheme1664439625825 implements MigrationInterface {
  name = 'UpdateTestTheme1664439625825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_theme" ADD "themeType" character varying NOT NULL DEFAULT 'TEST'`);
    await queryRunner.query(`COMMENT ON COLUMN "test_theme"."themeType" IS 'Тип темы'`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`COMMENT ON COLUMN "test_theme"."themeType" IS 'Тип темы'`);
    await queryRunner.query(`ALTER TABLE "test_theme" DROP COLUMN "themeType"`);
  }
}

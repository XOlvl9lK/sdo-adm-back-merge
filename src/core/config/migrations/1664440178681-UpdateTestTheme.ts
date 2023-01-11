import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTestTheme1664440178681 implements MigrationInterface {
  name = 'UpdateTestTheme1664440178681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ADD "themeId" character varying`);
    await queryRunner.query(`COMMENT ON COLUMN "test_question"."themeId" IS 'ID сущности'`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(
      `ALTER TABLE "test_question" ADD CONSTRAINT "FK_7a6b8d6f09bd853c0ec8efdfa90" FOREIGN KEY ("themeId") REFERENCES "test_theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" DROP CONSTRAINT "FK_7a6b8d6f09bd853c0ec8efdfa90"`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`COMMENT ON COLUMN "test_question"."themeId" IS 'ID сущности'`);
    await queryRunner.query(`ALTER TABLE "test_question" DROP COLUMN "themeId"`);
  }
}

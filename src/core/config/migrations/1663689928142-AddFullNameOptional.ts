import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullNameOptional1663689928142 implements MigrationInterface {
  name = 'AddFullNameOptional1663689928142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP DEFAULT`);
    await queryRunner.query(`UPDATE public."user" SET "fullName" = NULL WHERE "fullName" = ''`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47"`);
    await queryRunner.query(`COMMENT ON COLUMN "program_element"."testSettingsId" IS 'ID настроек теста'`);
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47" FOREIGN KEY ("testSettingsId") REFERENCES "test_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "program_element" DROP CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47"`);
    await queryRunner.query(`COMMENT ON COLUMN "program_element"."testSettingsId" IS 'ID сущности'`);
    await queryRunner.query(
      `ALTER TABLE "program_element" ADD CONSTRAINT "FK_21213d6d73a3f31c45f3c594b47" FOREIGN KEY ("testSettingsId") REFERENCES "test_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET NOT NULL`);
  }
}

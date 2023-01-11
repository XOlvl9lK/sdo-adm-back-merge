import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserName1663235371661 implements MigrationInterface {
  name = 'ChangeUserName1663235371661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public."user" SET "firstName" = '' WHERE "firstName" IS NULL`);
    await queryRunner.query(`UPDATE public."user" SET "middleName" = '' WHERE "middleName" IS NULL`);
    await queryRunner.query(`UPDATE public."user" SET "lastName" = '' WHERE "lastName" IS NULL`);
    await queryRunner.query(`UPDATE public."user" SET "fullName" = '' WHERE "fullName" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "middleName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "middleName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "middleName" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "middleName" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
  }
}

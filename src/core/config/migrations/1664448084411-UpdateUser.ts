import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1664448084411 implements MigrationInterface {
  name = 'UpdateUser1664448084411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAttempt1665562202736 implements MigrationInterface {
  name = 'UpdateAttempt1665562202736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
    await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "status" SET DEFAULT 'Не завершен'`);
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
    await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "status" SET DEFAULT 'Не завершён'`);
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
  }
}

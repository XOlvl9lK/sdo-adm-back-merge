import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEducationRequest1665391685002 implements MigrationInterface {
  name = 'UpdateEducationRequest1665391685002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "correctAnswer"`);
    await queryRunner.query(`ALTER TABLE "education_request" ADD "assignmentId" character varying`);
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "UQ_ef51b95bb3a879fc78f1c2d8879" UNIQUE ("assignmentId")`,
    );
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(
      `ALTER TABLE "education_request" ADD CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "UQ_ef51b95bb3a879fc78f1c2d8879"`);
    await queryRunner.query(`ALTER TABLE "education_request" DROP COLUMN "assignmentId"`);
    await queryRunner.query(`ALTER TABLE "answer" ADD "correctAnswer" text`);
  }
}

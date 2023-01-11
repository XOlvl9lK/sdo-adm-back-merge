import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSavedQuestionsOrder1664358665072 implements MigrationInterface {
  name = 'UpdateSavedQuestionsOrder1664358665072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "saved_questions_order"`);
    await queryRunner.query(`ALTER TABLE "saved_questions_order" DROP CONSTRAINT "FK_ed16225d2274ce0774c2604d4be"`);
    await queryRunner.query(`ALTER TABLE "saved_questions_order" RENAME COLUMN "performanceId" TO "testAttemptId"`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(`ALTER TABLE "forum" ALTER COLUMN "order" DROP NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "saved_questions_order"."testAttemptId" IS 'ID попытки'`);
    await queryRunner.query(
      `ALTER TABLE "saved_questions_order" ADD CONSTRAINT "FK_2ee376e1573a9252d3e96ab3f25" FOREIGN KEY ("testAttemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_questions_order" DROP CONSTRAINT "FK_2ee376e1573a9252d3e96ab3f25"`);
    await queryRunner.query(`COMMENT ON COLUMN "saved_questions_order"."testAttemptId" IS 'ID успеваемости'`);
    await queryRunner.query(`ALTER TABLE "forum" ALTER COLUMN "order" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
    await queryRunner.query(`ALTER TABLE "saved_questions_order" RENAME COLUMN "testAttemptId" TO "performanceId"`);
    await queryRunner.query(
      `ALTER TABLE "saved_questions_order" ADD CONSTRAINT "FK_ed16225d2274ce0774c2604d4be" FOREIGN KEY ("performanceId") REFERENCES "performance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

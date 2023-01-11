import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDurationDefaultValue1663144245078 implements MigrationInterface {
  name = 'CreateDurationDefaultValue1663144245078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT '0.5'`);
    await queryRunner.query(`ALTER TABLE "education_element" ALTER COLUMN "duration" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "education_element" ALTER COLUMN "duration" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "test_question" ALTER COLUMN "complexity" SET DEFAULT 0.5`);
  }
}

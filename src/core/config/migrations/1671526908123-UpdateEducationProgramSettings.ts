import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEducationProgramSettings1671526908123 implements MigrationInterface {
  name = 'UpdateEducationProgramSettings1671526908123'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "education_program_settings" ALTER COLUMN "isObligatory" SET DEFAULT true`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "education_program_settings" ALTER COLUMN "isObligatory" SET DEFAULT false`)
  }
}
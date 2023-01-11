import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEducationProgramSettings1670927353417 implements MigrationInterface {
  name = 'UpdateEducationProgramSettings1670927353417'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "education_program_settings" ADD "isObligatory" boolean DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "education_program_settings" DROP COLUMN "isObligatory"`)
  }
}
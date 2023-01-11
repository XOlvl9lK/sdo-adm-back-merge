import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInstaller1672128452973 implements MigrationInterface {
  name = 'UpdateInstaller1672128452973'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "library_file" ADD "versionDate" timestamp`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "education_program_settings" DROP COLUMN "versionDate"`)
  }
}
import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateApplicationSettings1666872192499 implements MigrationInterface {
    name = 'UpdateApplicationSettings1666872192499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_settings" ADD "value" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "application_settings"."value" IS 'Значение'`);
        await queryRunner.query(`COMMENT ON COLUMN "application_settings"."isActive" IS 'Активность'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
        await queryRunner.query(`COMMENT ON COLUMN "application_settings"."isActive" IS 'активность'`);
        await queryRunner.query(`COMMENT ON COLUMN "application_settings"."value" IS 'Значение'`);
        await queryRunner.query(`ALTER TABLE "application_settings" DROP COLUMN "value"`);
    }

}

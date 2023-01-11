import {MigrationInterface, QueryRunner} from "typeorm";


export class UpdateUserInGroup1668171291561 implements MigrationInterface {
    name = 'UpdateUserInGroup1668171291561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
        await queryRunner.query(`ALTER TABLE "performance" ALTER COLUMN "status" SET DEFAULT 'Не начат'`);
        await queryRunner.query(`ALTER TABLE "education_request" ADD CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education_request" DROP CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879"`);
        await queryRunner.query(`ALTER TABLE "performance" ALTER COLUMN "status" SET DEFAULT 'Не открывался'`);
        await queryRunner.query(`ALTER TABLE "education_request" ADD CONSTRAINT "FK_ef51b95bb3a879fc78f1c2d8879" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

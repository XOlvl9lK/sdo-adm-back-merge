import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeDeletePerformance1667373660782 implements MigrationInterface {
    name = 'CascadeDeletePerformance1667373660782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_6fd9c066fd413b200754bde4c74"`);
        await queryRunner.query(`ALTER TABLE "performance" ADD CONSTRAINT "FK_6fd9c066fd413b200754bde4c74" FOREIGN KEY ("lastAttemptId") REFERENCES "attempt"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_6fd9c066fd413b200754bde4c74"`);
        await queryRunner.query(`ALTER TABLE "performance" ADD CONSTRAINT "FK_6fd9c066fd413b200754bde4c74" FOREIGN KEY ("lastAttemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

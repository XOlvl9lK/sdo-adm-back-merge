import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatePerformance1668171771914 implements MigrationInterface {
    name = 'UpdatePerformance1668171771914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_509ec272cd823473a381261981e"`);
        await queryRunner.query(`ALTER TABLE "performance" ADD CONSTRAINT "FK_509ec272cd823473a381261981e" FOREIGN KEY ("performance_id") REFERENCES "performance"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "performance" DROP CONSTRAINT "FK_509ec272cd823473a381261981e"`);
        await queryRunner.query(`ALTER TABLE "performance" ADD CONSTRAINT "FK_509ec272cd823473a381261981e" FOREIGN KEY ("performance_id") REFERENCES "performance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

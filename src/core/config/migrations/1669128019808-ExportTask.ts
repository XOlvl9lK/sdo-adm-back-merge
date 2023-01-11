import {MigrationInterface, QueryRunner} from "typeorm";

export class ExportTask1669128019808 implements MigrationInterface {
    name = 'ExportTask1669128019808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "export_task" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "userId" character varying NOT NULL, "page" text NOT NULL, "finishDate" TIMESTAMP, "status" text NOT NULL, "errorDescription" text, CONSTRAINT "PK_8555070c4c907d07d55a7bf2ae2" PRIMARY KEY ("id")); COMMENT ON COLUMN "export_task"."id" IS 'ID сущности'; COMMENT ON COLUMN "export_task"."createdAt" IS 'Дата создания'; COMMENT ON COLUMN "export_task"."updatedAt" IS 'Дата обновления'; COMMENT ON COLUMN "export_task"."isArchived" IS 'Признак архивности'; COMMENT ON COLUMN "export_task"."userId" IS 'ID пользователя'; COMMENT ON COLUMN "export_task"."page" IS 'Страница экспорта'; COMMENT ON COLUMN "export_task"."finishDate" IS 'Дата завершения задачи'; COMMENT ON COLUMN "export_task"."status" IS 'Статус задачи'; COMMENT ON COLUMN "export_task"."errorDescription" IS 'Описание ошибки'`);
        await queryRunner.query(`ALTER TABLE "export_task" ADD CONSTRAINT "FK_8ac6b2d77c5c57d71d7c9717daf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_task" DROP CONSTRAINT "FK_8ac6b2d77c5c57d71d7c9717daf"`);
        await queryRunner.query(`DROP TABLE "export_task"`);
    }

}

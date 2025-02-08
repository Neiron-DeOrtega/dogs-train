import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734699058833 implements MigrationInterface {
    name = 'Migrations1734699058833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD \`isCompleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP COLUMN \`isCompleted\``);
    }

}

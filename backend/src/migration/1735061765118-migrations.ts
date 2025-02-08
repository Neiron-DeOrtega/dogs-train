import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735061765118 implements MigrationInterface {
    name = 'Migrations1735061765118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP COLUMN \`isCompleted\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD \`isCompleted\` tinyint NOT NULL DEFAULT '0'`);
    }

}

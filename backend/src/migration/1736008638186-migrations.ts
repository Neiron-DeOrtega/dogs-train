import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736008638186 implements MigrationInterface {
    name = 'Migrations1736008638186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_2116024230af8548e59f92cdbdf\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_2116024230af8548e59f92cdbdf\` FOREIGN KEY (\`trainingSurveyUserId\`) REFERENCES \`training_survey_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_2116024230af8548e59f92cdbdf\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_2116024230af8548e59f92cdbdf\` FOREIGN KEY (\`trainingSurveyUserId\`) REFERENCES \`training_survey_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

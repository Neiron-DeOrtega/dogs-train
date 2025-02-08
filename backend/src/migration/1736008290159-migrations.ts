import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736008290159 implements MigrationInterface {
    name = 'Migrations1736008290159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_3314dbd62b485e1c7bf5ce0ce9a\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_3314dbd62b485e1c7bf5ce0ce9a\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_3314dbd62b485e1c7bf5ce0ce9a\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_3314dbd62b485e1c7bf5ce0ce9a\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736008496036 implements MigrationInterface {
    name = 'Migrations1736008496036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_7116c5d74f020e74ef3e632c4f0\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_7116c5d74f020e74ef3e632c4f0\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_7116c5d74f020e74ef3e632c4f0\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_7116c5d74f020e74ef3e632c4f0\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

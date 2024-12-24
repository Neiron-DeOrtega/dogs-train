import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735045370255 implements MigrationInterface {
    name = 'Migrations1735045370255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP FOREIGN KEY \`FK_0eb8157b226b658f0fde9a79308\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP FOREIGN KEY \`FK_9b9d942f485932b98bd78e1e9f0\``);
        await queryRunner.query(`CREATE TABLE \`training_survey_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isCompleted\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, \`surveyId\` int NULL, \`bestDogOwnerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP COLUMN \`bestDogOwnerId\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP COLUMN \`isCompleted\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_1c874268bc7081e5d0816eea9e3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_3314dbd62b485e1c7bf5ce0ce9a\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_77c884d16802f3b82a9e2700fd4\` FOREIGN KEY (\`bestDogOwnerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_77c884d16802f3b82a9e2700fd4\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_3314dbd62b485e1c7bf5ce0ce9a\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_1c874268bc7081e5d0816eea9e3\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD \`isCompleted\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD \`bestDogOwnerId\` int NULL`);
        await queryRunner.query(`DROP TABLE \`training_survey_user\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD CONSTRAINT \`FK_9b9d942f485932b98bd78e1e9f0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD CONSTRAINT \`FK_0eb8157b226b658f0fde9a79308\` FOREIGN KEY (\`bestDogOwnerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

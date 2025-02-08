import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734696426345 implements MigrationInterface {
    name = 'Migrations1734696426345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`dogName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_rating\` (\`id\` int NOT NULL AUTO_INCREMENT, \`exerciseName\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`surveyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`training_survey\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` datetime NOT NULL, \`isConfirmed\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, \`bestDogOwnerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_7116c5d74f020e74ef3e632c4f0\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD CONSTRAINT \`FK_9b9d942f485932b98bd78e1e9f0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training_survey\` ADD CONSTRAINT \`FK_0eb8157b226b658f0fde9a79308\` FOREIGN KEY (\`bestDogOwnerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP FOREIGN KEY \`FK_0eb8157b226b658f0fde9a79308\``);
        await queryRunner.query(`ALTER TABLE \`training_survey\` DROP FOREIGN KEY \`FK_9b9d942f485932b98bd78e1e9f0\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_7116c5d74f020e74ef3e632c4f0\``);
        await queryRunner.query(`DROP TABLE \`training_survey\``);
        await queryRunner.query(`DROP TABLE \`exercise_rating\``);
        await queryRunner.query(`DROP INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

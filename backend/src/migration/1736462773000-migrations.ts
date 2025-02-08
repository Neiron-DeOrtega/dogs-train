import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736462773000 implements MigrationInterface {
    name = 'Migrations1736462773000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_77c884d16802f3b82a9e2700fd4\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_77c884d16802f3b82a9e2700fd4\` FOREIGN KEY (\`bestDogOwnerId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` DROP FOREIGN KEY \`FK_77c884d16802f3b82a9e2700fd4\``);
        await queryRunner.query(`ALTER TABLE \`training_survey_user\` ADD CONSTRAINT \`FK_77c884d16802f3b82a9e2700fd4\` FOREIGN KEY (\`bestDogOwnerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

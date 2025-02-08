import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735055663682 implements MigrationInterface {
    name = 'Migrations1735055663682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_7116c5d74f020e74ef3e632c4f0\` ON \`exercise_rating\``);
        await queryRunner.query(`DROP INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` ADD CONSTRAINT \`FK_7116c5d74f020e74ef3e632c4f0\` FOREIGN KEY (\`surveyId\`) REFERENCES \`training_survey\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` DROP FOREIGN KEY \`FK_7116c5d74f020e74ef3e632c4f0\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\` (\`phoneNumber\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_7116c5d74f020e74ef3e632c4f0\` ON \`exercise_rating\` (\`surveyId\`)`);
    }

}

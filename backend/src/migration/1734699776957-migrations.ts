import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734699776957 implements MigrationInterface {
    name = 'Migrations1734699776957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` CHANGE \`rating\` \`rating\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_rating\` CHANGE \`rating\` \`rating\` int NOT NULL`);
    }

}

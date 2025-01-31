import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1738193162847 implements MigrationInterface {
    name = 'SchemaUpdate1738193162847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`text\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`text\` varchar(1500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`text\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`text\` varchar(255) NOT NULL`);
    }

}

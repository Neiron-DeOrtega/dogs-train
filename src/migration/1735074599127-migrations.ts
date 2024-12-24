import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1735074599127 implements MigrationInterface {
    name = 'Migrations1735074599127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_f2578043e491921209f5dadd08\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1738201583235 implements MigrationInterface {
    name = 'SchemaUpdate1738201583235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_9dcde1b1308b5f22f34b8454e28\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_9dcde1b1308b5f22f34b8454e28\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_9dcde1b1308b5f22f34b8454e28\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_9dcde1b1308b5f22f34b8454e28\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

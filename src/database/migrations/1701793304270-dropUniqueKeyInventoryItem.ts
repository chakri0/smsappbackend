import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUniqueKeyInventoryItem1701793304270
	implements MigrationInterface
{
	name = 'DropUniqueKeyInventoryItem1701793304270';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` DROP FOREIGN KEY \`FK_7f3ac6a029ff2a5a4b790af9fcc\``,
		);
		await queryRunner.query(
			`DROP INDEX \`REL_7f3ac6a029ff2a5a4b790af9fc\` ON \`InventoryItems\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` ADD CONSTRAINT \`FK_7f3ac6a029ff2a5a4b790af9fcc\` FOREIGN KEY (\`itemId\`) REFERENCES \`Items\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` DROP FOREIGN KEY \`FK_7f3ac6a029ff2a5a4b790af9fcc\``,
		);
	}
}

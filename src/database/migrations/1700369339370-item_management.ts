import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemManagement1700369339370 implements MigrationInterface {
	name = 'ItemManagement1700369339370';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`Categories\` (\`id\` varchar(64) NOT NULL, \`name\` varchar(64) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`Items\` (\`id\` varchar(64) NOT NULL, \`name\` varchar(64) NOT NULL, \`description\` varchar(256) NULL, \`image\` text NULL, \`dailyThreshold\` bigint NULL, \`weeklyThreshold\` bigint NULL, \`overallThreshold\` bigint NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`categoryId\` varchar(64) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`InventoryItems\` (\`id\` varchar(64) NOT NULL, \`quantity\` bigint NOT NULL, \`availableQuantity\` bigint NOT NULL, \`status\` enum ('InStock', 'consumed') NOT NULL, \`expireDate\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`addedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`addedBy\` varchar(64) NULL, \`itemId\` varchar(64) NULL, UNIQUE INDEX \`REL_7f3ac6a029ff2a5a4b790af9fc\` (\`itemId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`Items\` ADD CONSTRAINT \`FK_030ccb84c762ca5597340d19f14\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` ADD CONSTRAINT \`FK_cc2c80713359b84716eb440dd35\` FOREIGN KEY (\`addedBy\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` ADD CONSTRAINT \`FK_7f3ac6a029ff2a5a4b790af9fcc\` FOREIGN KEY (\`itemId\`) REFERENCES \`Items\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` DROP FOREIGN KEY \`FK_7f3ac6a029ff2a5a4b790af9fcc\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` DROP FOREIGN KEY \`FK_cc2c80713359b84716eb440dd35\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`Items\` DROP FOREIGN KEY \`FK_030ccb84c762ca5597340d19f14\``,
		);
		await queryRunner.query(
			`DROP INDEX \`REL_7f3ac6a029ff2a5a4b790af9fc\` ON \`InventoryItems\``,
		);
		await queryRunner.query(`DROP TABLE \`InventoryItems\``);
		await queryRunner.query(
			`DROP INDEX \`REL_030ccb84c762ca5597340d19f1\` ON \`Items\``,
		);
		await queryRunner.query(`DROP TABLE \`Items\``);
		await queryRunner.query(`DROP TABLE \`Categories\``);
	}
}

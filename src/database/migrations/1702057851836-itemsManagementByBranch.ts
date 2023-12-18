import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemsManagementByBranch1702057851836
	implements MigrationInterface
{
	name = 'ItemsManagementByBranch1702057851836';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` ADD \`branchId\` varchar(64) NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`Items\` ADD \`branchId\` varchar(64) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` ADD CONSTRAINT \`FK_006b281bcd5095dc82fbd07708d\` FOREIGN KEY (\`branchId\`) REFERENCES \`Branch\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`Items\` ADD CONSTRAINT \`FK_0adc16e3dac30a407cdd426dab2\` FOREIGN KEY (\`branchId\`) REFERENCES \`Branch\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`Items\` DROP FOREIGN KEY \`FK_0adc16e3dac30a407cdd426dab2\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`InventoryItems\` DROP FOREIGN KEY \`FK_006b281bcd5095dc82fbd07708d\``,
		);
		await queryRunner.query(`ALTER TABLE Items DROP branchId`);
		await queryRunner.query(`ALTER TABLE InventoryItems DROP branchId`);
	}
}

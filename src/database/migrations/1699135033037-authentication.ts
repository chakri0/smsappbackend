import { MigrationInterface, QueryRunner } from 'typeorm';

export class Authentication1699135033037 implements MigrationInterface {
	name = 'Authentication1699135033037';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`UserRole\` (\`id\` varchar(64) NOT NULL, \`roleName\` enum ('superAdmin', 'admin', 'manager') NOT NULL, \`isVerified\` tinyint(1) NOT NULL, \`isActivated\` tinyint(1) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(64) NULL, UNIQUE INDEX \`REL_c09e6f704c7cd9fe2bbc26a1a3\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`User\` (\`id\` varchar(64) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`firstName\` varchar(64) NULL, \`lastName\` varchar(64) NULL, \`avatar\` text NULL, \`timezone\` varchar(255) NULL, \`phoneNumber\` bigint NULL, \`loginAttempt\` int NOT NULL DEFAULT '0', \`loginAttemptAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`branchId\` varchar(64) NULL, UNIQUE INDEX \`IDX_4a257d2c9837248d70640b3e36\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`Branch\` (\`id\` varchar(64) NOT NULL, \`storeName\` varchar(64) NOT NULL, \`storeAddress\` varchar(128) NOT NULL, \`phoneNumber\` bigint NULL, \`image\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`RefreshToken\` (\`id\` varchar(64) NOT NULL, \`token\` text NOT NULL, \`slackToken\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roleId\` varchar(64) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`AccessToken\` (\`id\` varchar(64) NOT NULL, \`token\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roleId\` varchar(64) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`EmailToken\` (\`id\` varchar(64) NOT NULL, \`token\` text NOT NULL, \`tokenType\` enum ('forgotpassword', 'registration','invite') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roleId\` varchar(64) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`UserRole\` ADD CONSTRAINT \`FK_c09e6f704c7cd9fe2bbc26a1a38\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`User\` ADD CONSTRAINT \`FK_fd0436c2c791f0b966c7ed24e13\` FOREIGN KEY (\`branchId\`) REFERENCES \`Branch\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`RefreshToken\` ADD CONSTRAINT \`FK_d4578f65c2700a6c62fc7344fa0\` FOREIGN KEY (\`roleId\`) REFERENCES \`UserRole\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`AccessToken\` ADD CONSTRAINT \`FK_0324f22657de4c4aae50db17dd5\` FOREIGN KEY (\`roleId\`) REFERENCES \`UserRole\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`EmailToken\` ADD CONSTRAINT \`FK_1988799027fa91a4c6ac411f16f\` FOREIGN KEY (\`roleId\`) REFERENCES \`UserRole\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`EmailToken\` DROP FOREIGN KEY \`FK_1988799027fa91a4c6ac411f16f\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`AccessToken\` DROP FOREIGN KEY \`FK_0324f22657de4c4aae50db17dd5\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`RefreshToken\` DROP FOREIGN KEY \`FK_d4578f65c2700a6c62fc7344fa0\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`User\` DROP FOREIGN KEY \`FK_fd0436c2c791f0b966c7ed24e13\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`UserRole\` DROP FOREIGN KEY \`FK_c09e6f704c7cd9fe2bbc26a1a38\``,
		);
		await queryRunner.query(`DROP TABLE \`EmailToken\``);
		await queryRunner.query(`DROP TABLE \`AccessToken\``);
		await queryRunner.query(`DROP TABLE \`RefreshToken\``);
		await queryRunner.query(`DROP TABLE \`Branch\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_4a257d2c9837248d70640b3e36\` ON \`User\``,
		);
		await queryRunner.query(`DROP TABLE \`User\``);
		await queryRunner.query(
			`DROP INDEX \`REL_c09e6f704c7cd9fe2bbc26a1a3\` ON \`UserRole\``,
		);
		await queryRunner.query(`DROP TABLE \`UserRole\``);
	}
}

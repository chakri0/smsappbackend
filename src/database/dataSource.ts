import { DataSource } from 'typeorm';
// import { getConfig } from "../config/config";
import * as mysqlDriver from 'mysql2';
import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export function getConfig() {
	return {
		driver: mysqlDriver,
		type: 'mysql',
		host: 'smsappdatabase.cvwwxdsqezfl.us-east-1.rds.amazonaws.com',
		port: process.env.MY_SQL_PORT,
		username: 'admin',
		password: 'test1234',
		database: 'phillypizza_local',
		synchronize: false,
		migrations: ['src/database/migrations/*.ts'],
		entities: ['src/database/entities/*.ts'],
	} as DataSourceOptions;
}

const datasource = new DataSource(getConfig());
void datasource.initialize();
export default datasource;

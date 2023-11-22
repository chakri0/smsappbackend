import config from './config';

export interface IAppConfig {
	app: {
		frontend: {
			baseUrl: string;
			accountSetup: string;
		};
		backend: {
			baseUrl: string;
		};
	};
	email: {
		host: string;
		port: number;
		fromEmail: string;
		secure: boolean;
		auth: {
			user: string;
			pass: string;
		};
		logger: boolean;
	};

	jwtSecretKey: string;
}
const appConfig: IAppConfig = config;

export default appConfig;

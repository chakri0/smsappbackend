import * as winston from 'winston';

export class WinstonLogger {
	private logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					level: 'debug',
					handleExceptions: true,
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.prettyPrint({ colorize: true }),
					),
				}),
			],
			exitOnError: false,
		});
	}

	public debug(message: string, metaData?: object) {
		this.logger.debug(message, metaData);
	}

	public info(message: string, metaData?: object) {
		this.logger.info(message, metaData);
	}

	public error(message: string, metaData?: object) {
		this.logger.error(message, metaData);
	}
}

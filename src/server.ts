import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import { ErrorMiddleware } from './middleware/ErrorMiddleware';
import Routes from './routes';
import { WinstonLogger } from './common/logging/WinstonLogger';

// reload path
process.env.NODE_PATH = __dirname;

class Server {
	private app: Application;
	private routes: Routes;
	private errorMiddleware!: ErrorMiddleware;
	private port: number;
	private logger: WinstonLogger;

	constructor() {
		this.app = express();
		this.routes = new Routes();
		this.port = Number(process.env.PORT) || 3000;
		this.logger = new WinstonLogger();

		dotenv.config();
		this.configureMiddleware();
		this.configureRoutes();
		this.configErrorMiddleware();
		this.startServer();
	}

	private configureMiddleware() {
		this.app.use(express.json());
		const corsOptions: CorsOptions = {
			origin: 'http://localhost:1234',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			credentials: true,
		};
		this.app.use(cors(corsOptions));
	}

	private configureRoutes() {
		this.app.use('/api', this.routes.getRouter());
	}

	private configErrorMiddleware() {
		this.errorMiddleware = new ErrorMiddleware();
		this.app.use(this.errorMiddleware.handler());
	}

	private startServer() {
		this.app.listen(this.port, () => {
			this.logger.info(`App listning on the port ${this.port}`);
		});
	}
}

new Server();

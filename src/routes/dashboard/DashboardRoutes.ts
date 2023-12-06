import express, { Router } from 'express';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';
import DashboardController from '../../controllers/dashboardController/DashboardController';

export class DashboardRoutes {
	private router: Router;
	private auth: AuthenticationService;
	private dashboardController: DashboardController;
	constructor() {
		this.router = express.Router();
		this.auth = new AuthenticationService();
		this.dashboardController = new DashboardController();
		this.setupRoutes();
	}

	private setupRoutes() {
		this.router.get(
			'/getDetails',
			this.auth.verifyAccessToken,
			this.dashboardController.getDashboardDetails,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default new DashboardRoutes().getRouter();

import express, { Router } from 'express';
import UserController from '../../controllers/userController/UserController';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';

class UserRoutes {
	private router: Router;
	private userController: UserController;
	private auth: AuthenticationService;

	constructor() {
		this.router = express.Router();
		this.userController = new UserController();
		this.auth = new AuthenticationService();
		this.setupRoutes();
	}

	private setupRoutes() {
		// Auth the user
		this.router.post('/login', this.userController.userLogin);
		this.router.post(
			'/invite',
			this.auth.verifyAccessToken,
			this.userController.inviteUser,
		);
		this.router.post('/verify', this.userController.verifyUser);
		this.router.post('/setup', this.userController.accoutSetup);
		this.router.get(
			'/listByBranch/:branchId',
			this.auth.verifyAccessToken,
			this.userController.usersListByBranch,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default UserRoutes;

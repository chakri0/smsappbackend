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
		this.router.post('/setup', this.userController.accountSetup);
		this.router.post('/forgotPassword', this.userController.forgotPassword);
		this.router.post('/resetPassword', this.userController.resetPassword);
		this.router.post(
			'/invite',
			this.auth.verifyAccessToken,
			this.userController.inviteUser,
		);
		this.router.put(
			'/updateProfile',
			this.auth.verifyAccessToken,
			this.userController.updateProfile,
		);
		this.router.get(
			'/listByBranch/:branchId',
			this.auth.verifyAccessToken,
			this.userController.usersListByBranch,
		);
		this.router.get(
			'/me',
			this.auth.verifyAccessToken,
			this.userController.profile,
		);
		this.router.put(
			'/updateUser',
			this.auth.verifyAccessToken,
			this.userController.updateUser,
		);
		this.router.delete(
			'/deleteUser/:userId',
			this.auth.verifyAccessToken,
			this.userController.deleteUser,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default UserRoutes;

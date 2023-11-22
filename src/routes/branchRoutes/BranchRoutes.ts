import express, { Router } from 'express';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';
import BranchController from '../../controllers/branchController/BranchController';

export class BranchRoutes {
	private router: Router;
	private auth: AuthenticationService;
	private branchController: BranchController;
	constructor() {
		this.router = express.Router();
		this.auth = new AuthenticationService();
		this.branchController = new BranchController();
		this.setupRoutes();
	}

	private setupRoutes() {
		this.router.post(
			'/add',
			this.auth.verifyAccessToken,
			this.branchController.addBranch,
		);
		this.router.get(
			'/list',
			this.auth.verifyAccessToken,
			this.branchController.branchList,
		);
		this.router.put(
			'/update/:branchId',
			this.auth.verifyAccessToken,
			this.branchController.updateBranch,
		);
		this.router.delete(
			'/delete/:branchId',
			this.auth.verifyAccessToken,
			this.branchController.deleteBranch,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default new BranchRoutes().getRouter();

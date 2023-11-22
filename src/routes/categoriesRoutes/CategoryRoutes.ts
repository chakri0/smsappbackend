import express, { Router } from 'express';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';
import CategoryController from '../../controllers/categoryController/CategoryController';

export class CategoryRoutes {
	private router: Router;
	private auth: AuthenticationService;
	private categoryController: CategoryController;
	constructor() {
		this.router = express.Router();
		this.auth = new AuthenticationService();
		this.categoryController = new CategoryController();
		this.setupRoutes();
	}

	private setupRoutes() {
		this.router.post(
			'/add',
			this.auth.verifyAccessToken,
			this.categoryController.addCategory,
		);
		this.router.get(
			'/list',
			this.auth.verifyAccessToken,
			this.categoryController.categoryList,
		);
		this.router.put(
			'/update/:categoryId',
			this.auth.verifyAccessToken,
			this.categoryController.updateCategory,
		);
		this.router.delete(
			'/delete/:categoryId',
			this.auth.verifyAccessToken,
			this.categoryController.deleteCategory,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default new CategoryRoutes().getRouter();

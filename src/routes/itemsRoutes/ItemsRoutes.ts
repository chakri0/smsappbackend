import express, { Router } from 'express';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';
import ItemsController from '../../controllers/itemsController/itemsController';

export class ItemsRoutes {
	private router: Router;
	private auth: AuthenticationService;
	private itemController: ItemsController;
	constructor() {
		this.router = express.Router();
		this.auth = new AuthenticationService();
		this.itemController = new ItemsController();
		this.setupRoutes();
	}

	private setupRoutes() {
		this.router.post(
			'/add',
			this.auth.verifyAccessToken,
			this.itemController.addItems,
		);
		this.router.get(
			'/list',
			this.auth.verifyAccessToken,
			this.itemController.itemList,
		);
		this.router.put(
			'/update/:itemId',
			this.auth.verifyAccessToken,
			this.itemController.updateItem,
		);
		this.router.delete(
			'/delete/:itemId',
			this.auth.verifyAccessToken,
			this.itemController.deleteItem,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default new ItemsRoutes().getRouter();

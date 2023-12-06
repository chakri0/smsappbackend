import express, { Router } from 'express';
import AuthenticationService from '../../database/instanses/authentication/AuthenticationService';
import InventoryItemsController from '../../controllers/inventoryItemsController/InventoryItemsController';

export class InventoryItemsRoutes {
	private router: Router;
	private auth: AuthenticationService;
	private inventoryItemController: InventoryItemsController;
	constructor() {
		this.router = express.Router();
		this.auth = new AuthenticationService();
		this.inventoryItemController = new InventoryItemsController();
		this.setupRoutes();
	}

	private setupRoutes() {
		this.router.post(
			'/add',
			this.auth.verifyAccessToken,
			this.inventoryItemController.addInventoryItems,
		);
		this.router.get(
			'/list',
			this.auth.verifyAccessToken,
			this.inventoryItemController.inventoryItemsList,
		);
		this.router.put(
			'/update/:inventoryItemId',
			this.auth.verifyAccessToken,
			this.inventoryItemController.updateInventoryItems,
		);
		this.router.delete(
			'/delete/:inventoryItemId',
			this.auth.verifyAccessToken,
			this.inventoryItemController.deleteInventoryItem,
		);
	}

	public getRouter() {
		return this.router;
	}
}

export default new InventoryItemsRoutes().getRouter();

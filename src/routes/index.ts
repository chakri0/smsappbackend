import express from 'express';
import UserRoutes from './userRoutes/UserRoutes';
import { BranchRoutes } from './branchRoutes/BranchRoutes';
import { ItemsRoutes } from './itemsRoutes/ItemsRoutes';
import { CategoryRoutes } from './categoriesRoutes/CategoryRoutes';
import { InventoryItemsRoutes } from './inventoryItemsRoutes/InventoryItemsRoutes';

class Routes {
	private router: express.Router;
	private userRoutes: UserRoutes;
	private branchRoutes: BranchRoutes;
	private categoryRoutes: CategoryRoutes;
	private itemRoutes: ItemsRoutes;
	private inventoryItemsRoutes: InventoryItemsRoutes;

	constructor() {
		this.router = express.Router();
		this.userRoutes = new UserRoutes();
		this.branchRoutes = new BranchRoutes();
		this.categoryRoutes = new CategoryRoutes();
		this.itemRoutes = new ItemsRoutes();
		this.inventoryItemsRoutes = new InventoryItemsRoutes();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.use('/user', this.userRoutes.getRouter());
		this.router.use('/branch', this.branchRoutes.getRouter());
		this.router.use('/category', this.categoryRoutes.getRouter());
		this.router.use('/item', this.itemRoutes.getRouter());
		this.router.use(
			'/inventory/item',
			this.inventoryItemsRoutes.getRouter(),
		);
	}

	public getRouter(): express.Router {
		return this.router;
	}
}

export default Routes;

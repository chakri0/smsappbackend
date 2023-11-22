import express from 'express';
import UserRoutes from './userRoutes/UserRoutes';
import { BranchRoutes } from './branchRoutes/BranchRoutes';
import { ItemsRoutes } from './itemsRoutes/ItemsRoutes';
import { CategoryRoutes } from './categoriesRoutes/CategoryRoutes';

class Routes {
	private router: express.Router;
	private userRoutes: UserRoutes;
	private branchRoutes: BranchRoutes;
	private categoryRoutes: CategoryRoutes;
	private itemRoutes: ItemsRoutes;

	constructor() {
		this.router = express.Router();
		this.userRoutes = new UserRoutes();
		this.branchRoutes = new BranchRoutes();
		this.categoryRoutes = new CategoryRoutes();
		this.itemRoutes = new ItemsRoutes();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.use('/user', this.userRoutes.getRouter());
		this.router.use('/branch', this.branchRoutes.getRouter());
		this.router.use('/category', this.categoryRoutes.getRouter());
		this.router.use('/item', this.itemRoutes.getRouter());
	}

	public getRouter(): express.Router {
		return this.router;
	}
}

export default Routes;

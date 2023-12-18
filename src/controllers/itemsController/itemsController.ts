import express from 'express';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { NotFoundException } from '../../common/exception/NotFoundException';
import { ItemsRepository } from '../../repositories/ItemsRepository';

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export interface ItemsReq {
	categoryId: string;
	name: string;
	description?: string;
	image?: string;
	dailyThreshold?: number;
	weeklyThreshold?: number;
	overallThreshold?: number;
	branchId: string;
}

class ItemsController {
	private itemRepository: ItemsRepository;
	constructor() {
		this.itemRepository = new ItemsRepository();
	}

	public addItems: express.RequestHandler = async (
		req: TypedRequestBody<ItemsReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const data = req.body;
			await this.itemRepository.addItem(data, activeUser.id);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};

	public itemList: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const itemList = await this.itemRepository.itemList(activeUser.id);
			res.status(200).json({ itemList });
		} catch (error) {
			next(error);
		}
	};

	public updateItem: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const { itemId } = req.params;
			const data = req.body as ItemsReq;
			await this.itemRepository.updateItem(data, itemId, activeUser.id);

			res.status(200).json({ message: 'Item updated successfully' });
		} catch (error) {
			next(error);
		}
	};

	public deleteItem: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}

			const { itemId } = req.params;
			await this.itemRepository.deleteItem(itemId, activeUser.id);
			res.status(200).json({ message: 'Item deleted successfully' });
		} catch (error) {
			next(error);
		}
	};

	public itemsListByBranch: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const { branchId } = req.params;
			const itemsList = await this.itemRepository.getItemListByBranch(
				activeUser.id,
				branchId,
			);
			res.status(200).json({ itemsList });
		} catch (error) {
			next(error);
		}
	};
}
export default ItemsController;
